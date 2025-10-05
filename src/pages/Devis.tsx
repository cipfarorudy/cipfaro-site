import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { formations } from '../data/formations';
import type { Formation } from '../types/formation';

interface DevisData {
  // Client info
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  clientAdresse: string;
  clientSiret: string;
  
  // Formation info
  formationSlug: string;
  mode: 'individuel' | 'groupe';
  participants: number;
  heures: number;
  lieu: string;
  periode: string;
  
  // Financial
  tva: number;
  coutCertification: number;
  
  // Admin
  refDevis: string;
  dateDevis: string;
  echeance: string;
}

const TARIF_HORAIRE_INDIVIDUEL = 15;
const TARIF_HORAIRE_GROUPE = 9;

const formatEUR = (amount: number): string => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

const generateRefDevis = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `DEVIS-${year}${month}${day}-${hours}${minutes}`;
};

const FormationSelector: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  formations: Formation[];
}> = ({ value, onValueChange, formations }) => (
  <div>
    <Label htmlFor="formation">Formation *</Label>
    <Select
      id="formation"
      value={value}
      onValueChange={onValueChange}
    >
      <option value="">— Choisir une formation —</option>
      {formations.map((formation) => (
        <option key={formation.slug} value={formation.slug}>
          {formation.titre}
        </option>
      ))}
    </Select>
  </div>
);

export default function Devis() {
  const [searchParams] = useSearchParams();
  const slugParam = searchParams.get('slug') || '';

  const [devisData, setDevisData] = useState<DevisData>({
    clientNom: '',
    clientEmail: '',
    clientTelephone: '',
    clientAdresse: '',
    clientSiret: '',
    formationSlug: slugParam,
    mode: 'individuel',
    participants: 1,
    heures: 0,
    lieu: 'CIP FARO Rudy (ou distanciel)',
    periode: 'Dates à définir',
    tva: 0,
    coutCertification: 0,
    refDevis: generateRefDevis(),
    dateDevis: new Date().toISOString().split('T')[0],
    echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const selectedFormation = useMemo(() => 
    formations.find((f) => f.slug === devisData.formationSlug) || null,
    [devisData.formationSlug]
  );

  // Mise à jour automatique des heures quand on change de formation
  useEffect(() => {
    if (selectedFormation && selectedFormation.duree) {
      // Extraire le nombre d'heures de la chaîne "840 heures" par exemple
      const match = selectedFormation.duree.match(/(\d+)\s*heures?/);
      if (match) {
        setDevisData(prev => ({ ...prev, heures: parseInt(match[1], 10) }));
      }
    }
  }, [selectedFormation]);

  const calculations = useMemo(() => {
    const tarifHoraire = devisData.mode === 'individuel' 
      ? TARIF_HORAIRE_INDIVIDUEL 
      : TARIF_HORAIRE_GROUPE;
    
    const sousTotal = devisData.heures * tarifHoraire;
    const totalFormation = devisData.mode === 'groupe' 
      ? sousTotal * devisData.participants 
      : sousTotal;
    
    const totalHT = totalFormation + devisData.coutCertification;
    const totalTVA = totalHT * (devisData.tva / 100);
    const totalTTC = totalHT + totalTVA;

    return {
      tarifHoraire,
      totalFormation,
      totalHT,
      totalTVA,
      totalTTC,
    };
  }, [devisData]);

  const updateDevisData = (field: keyof DevisData, value: string | number) => {
    setDevisData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateDevis = async () => {
    if (!selectedFormation) {
      alert('Veuillez sélectionner une formation');
      return;
    }

    if (!devisData.clientNom || !devisData.clientEmail) {
      alert('Veuillez remplir au minimum le nom et l\'email du client');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulation de génération de devis
      // Dans un vrai projet, cela ferait appel à une API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Devis généré avec succès ! (Fonctionnalité de téléchargement PDF à implémenter)');
    } catch (error) {
      alert('Erreur lors de la génération du devis');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = () => {
    if (!selectedFormation || !devisData.clientEmail) {
      alert('Veuillez sélectionner une formation et remplir l\'email du client');
      return;
    }

    const subject = encodeURIComponent(`Devis ${devisData.refDevis} - ${selectedFormation.titre}`);
    const body = encodeURIComponent(`Bonjour,

Veuillez trouver ci-joint notre devis pour la formation "${selectedFormation.titre}" :

• Référence : ${devisData.refDevis}
• Formation : ${selectedFormation.titre}
• Mode : ${devisData.mode === 'individuel' ? 'Individuel' : `Groupe (${devisData.participants} participants)`}
• Durée : ${devisData.heures}h
• Total HT : ${formatEUR(calculations.totalHT)}
• Total TTC : ${formatEUR(calculations.totalTTC)}

Nous restons à votre disposition pour tout complément d'information.

Cordialement,
CIP FARO Rudy
secretariat@cipfaro-formations.com`);

    const mailtoURL = `mailto:${devisData.clientEmail}?subject=${subject}&body=${body}`;
    window.open(mailtoURL);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Générateur de Devis</h1>
            <p className="text-xl opacity-90">
              Créez rapidement des devis personnalisés pour nos formations certifiantes et qualifiantes.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sélection de formation */}
            <Card>
              <CardHeader>
                <CardTitle>Formation</CardTitle>
                <CardDescription>
                  Sélectionnez la formation pour laquelle vous souhaitez générer un devis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormationSelector
                  value={devisData.formationSlug}
                  onValueChange={(value) => updateDevisData('formationSlug', value)}
                  formations={formations}
                />
                
                {selectedFormation && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      {selectedFormation.titre}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedFormation.certifiante && (
                        <Badge variant="success">Certifiante</Badge>
                      )}
                      {selectedFormation.rncp && (
                        <Badge variant="outline">RNCP: {selectedFormation.rncp}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-blue-800">
                      <strong>Durée:</strong> {selectedFormation.duree}<br />
                      <strong>Modalités:</strong> {selectedFormation.modalites}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Paramètres de formation */}
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de formation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mode">Mode de formation</Label>
                    <Select
                      id="mode"
                      value={devisData.mode}
                      onValueChange={(value: string) => updateDevisData('mode', value as 'individuel' | 'groupe')}
                    >
                      <option value="individuel">Individuel ({TARIF_HORAIRE_INDIVIDUEL}€/h)</option>
                      <option value="groupe">Groupe ({TARIF_HORAIRE_GROUPE}€/h par participant)</option>
                    </Select>
                  </div>

                  {devisData.mode === 'groupe' && (
                    <div>
                      <Label htmlFor="participants">Nombre de participants</Label>
                      <Input
                        id="participants"
                        type="number"
                        min="1"
                        max="20"
                        value={devisData.participants}
                        onChange={(e) => updateDevisData('participants', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heures">Durée en heures</Label>
                    <Input
                      id="heures"
                      type="number"
                      min="1"
                      value={devisData.heures}
                      onChange={(e) => updateDevisData('heures', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lieu">Lieu de formation</Label>
                    <Input
                      id="lieu"
                      value={devisData.lieu}
                      onChange={(e) => updateDevisData('lieu', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="periode">Période / Dates</Label>
                  <Input
                    id="periode"
                    value={devisData.periode}
                    onChange={(e) => updateDevisData('periode', e.target.value)}
                    placeholder="Ex: Semaine du 15 au 19 janvier 2025"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle>Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientNom">Nom / Société *</Label>
                    <Input
                      id="clientNom"
                      value={devisData.clientNom}
                      onChange={(e) => updateDevisData('clientNom', e.target.value)}
                      placeholder="Nom du client ou société"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientEmail">Email *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={devisData.clientEmail}
                      onChange={(e) => updateDevisData('clientEmail', e.target.value)}
                      placeholder="contact@client.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientTelephone">Téléphone</Label>
                    <Input
                      id="clientTelephone"
                      type="tel"
                      value={devisData.clientTelephone}
                      onChange={(e) => updateDevisData('clientTelephone', e.target.value)}
                      placeholder="0690 XX XX XX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientSiret">SIRET (optionnel)</Label>
                    <Input
                      id="clientSiret"
                      value={devisData.clientSiret}
                      onChange={(e) => updateDevisData('clientSiret', e.target.value)}
                      placeholder="123 456 789 00012"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="clientAdresse">Adresse</Label>
                  <Textarea
                    id="clientAdresse"
                    value={devisData.clientAdresse}
                    onChange={(e) => updateDevisData('clientAdresse', e.target.value)}
                    placeholder="Adresse complète du client"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Paramètres financiers */}
            <Card>
              <CardHeader>
                <CardTitle>Paramètres financiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tva">TVA (%)</Label>
                    <Input
                      id="tva"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={devisData.tva}
                      onChange={(e) => updateDevisData('tva', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      En formation professionnelle, TVA souvent 0%
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="coutCertification">Coût certification (optionnel)</Label>
                    <Input
                      id="coutCertification"
                      type="number"
                      min="0"
                      step="1"
                      value={devisData.coutCertification}
                      onChange={(e) => updateDevisData('coutCertification', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Récapitulatif du devis</CardTitle>
                <CardDescription>
                  Référence: {devisData.refDevis}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedFormation ? (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{selectedFormation.titre}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Mode: {devisData.mode === 'individuel' ? 'Individuel' : `Groupe (${devisData.participants} participants)`}</p>
                        <p>Durée: {devisData.heures} heures</p>
                        <p>Tarif horaire: {formatEUR(calculations.tarifHoraire)}</p>
                      </div>
                    </div>

                    <hr />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Formation HT:</span>
                        <span className="font-medium">{formatEUR(calculations.totalFormation)}</span>
                      </div>
                      
                      {devisData.coutCertification > 0 && (
                        <div className="flex justify-between">
                          <span>Certification:</span>
                          <span className="font-medium">{formatEUR(devisData.coutCertification)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Total HT:</span>
                        <span className="font-medium">{formatEUR(calculations.totalHT)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>TVA ({devisData.tva}%):</span>
                        <span className="font-medium">{formatEUR(calculations.totalTVA)}</span>
                      </div>
                      
                      <hr />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span>Net à payer TTC:</span>
                        <span className="text-primary-600">{formatEUR(calculations.totalTTC)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={handleGenerateDevis}
                        disabled={isGenerating}
                        loading={isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? 'Génération...' : '📄 Générer le devis PDF'}
                      </Button>
                      
                      <Button
                        onClick={handleSendEmail}
                        variant="outline"
                        className="w-full"
                      >
                        📧 Envoyer par email
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Sélectionnez une formation pour voir le récapitulatif
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Aide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Aide</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Les devis sont conformes aux exigences Qualiopi</p>
                <p>• Le programme de formation sera joint automatiquement</p>
                <p>• Les tarifs affichés sont nos tarifs standard</p>
                <p>• La TVA est généralement à 0% en formation professionnelle</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions secondaires */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/formations">← Retour aux formations</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Besoin d'aide ?</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}