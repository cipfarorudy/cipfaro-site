import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';

interface ContactFormData {
  nom: string;
  email: string;
  telephone: string;
  objet: string;
  message: string;
  wantsCallback: boolean;
  prefhoraire: string;
}

const ContactInfo: React.FC<{
  icon: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-lg">
        <span className="text-2xl">{icon}</span>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-gray-600">{children}</div>
    </CardContent>
  </Card>
);

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: '',
    email: '',
    telephone: '',
    objet: '',
    message: '',
    wantsCallback: false,
    prefhoraire: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSending(true);

    // Validation basique
    if (!formData.nom || !formData.email || !formData.objet || !formData.message) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      setIsSending(false);
      return;
    }

    // Simulation d'envoi (remplacez par fetch -> API réel si besoin)
    setTimeout(() => {
      setIsSending(false);
      setSuccessMessage('Votre message a bien été envoyé. Nous vous recontacterons sous 48h.');
      // Réinitialiser le formulaire en cas de succès
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        objet: '',
        message: '',
        wantsCallback: false,
        prefhoraire: '',
      });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl opacity-90">
              Une question ? Un projet de formation ? N'hésitez pas à nous contacter. 
              Notre équipe vous répondra dans les plus brefs délais.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ContactInfo icon="📍" title="Adresse">
              <div>
                <strong>CIP FARO Rudy</strong><br />
                Chemin Coulée Zebsi<br />
                97139 Les Abymes<br />
                Guadeloupe
              </div>
            </ContactInfo>

            <ContactInfo icon="📞" title="Téléphone">
              <div>
                <div className="mb-2">
                  <strong>Accueil :</strong><br />
                  <a href="tel:0690570846" className="text-primary-600 hover:underline">
                    0690 57 08 46
                  </a>
                </div>
                <div>
                  <strong>Secrétariat :</strong><br />
                  <a href="tel:069570846" className="text-primary-600 hover:underline">
                    0695 70 846
                  </a>
                </div>
              </div>
            </ContactInfo>

            <ContactInfo icon="✉️" title="Email">
              <div>
                <div className="mb-3">
                  <strong>Contact général :</strong><br />
                  <a 
                    href="mailto:secretariat@cipfaro-formations.com"
                    className="text-primary-600 hover:underline break-words"
                  >
                    secretariat@cipfaro-formations.com
                  </a>
                </div>
                <div>
                  <strong>Référent handicap :</strong><br />
                  <a 
                    href="mailto:referent.handicap@cipfaro-formations.com"
                    className="text-primary-600 hover:underline break-words"
                  >
                    referent.handicap@cipfaro-formations.com
                  </a>
                </div>
              </div>
            </ContactInfo>

            <ContactInfo icon="🕒" title="Horaires">
              <div>
                <div className="mb-2">
                  <strong>Lundi - Jeudi :</strong><br />
                  8h00 - 17h00
                </div>
                <div>
                  <strong>Vendredi :</strong><br />
                  8h00 - 16h00
                </div>
              </div>
            </ContactInfo>
          </div>

          {/* Contact Form */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Formulaire de contact
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire et nous vous recontacterons rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      required
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      placeholder="0690 XX XX XX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="objet">Objet de votre demande *</Label>
                    <Select
                      value={formData.objet}
                      onValueChange={(value: string) => handleInputChange('objet', value)}
                    >
                      <option value="">Choisissez un objet</option>
                      <option value="information-formation">Information sur une formation</option>
                      <option value="inscription">Demande d'inscription</option>
                      <option value="financement">Question sur le financement</option>
                      <option value="accessibilite">Accessibilité / Handicap</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    rows={5}
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="callback"
                      checked={formData.wantsCallback}
                      onCheckedChange={(checked: boolean) => handleInputChange('wantsCallback', !!checked)}
                    />
                    <Label htmlFor="callback" className="cursor-pointer">
                      Je souhaite être recontacté(e) par téléphone
                    </Label>
                  </div>

                  {formData.wantsCallback && (
                    <div className="ml-6">
                      <Label htmlFor="prefhoraire">Préférence horaire</Label>
                      <Input
                        id="prefhoraire"
                        name="prefhoraire"
                        value={formData.prefhoraire}
                        onChange={(e) => handleInputChange('prefhoraire', e.target.value)}
                        placeholder="Ex: Mardi matin, entre 9h et 12h"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSending}
                    loading={isSending}
                    className="flex-1 sm:flex-none"
                  >
                    {isSending ? 'Envoi en cours...' : 'Envoyer le message'}
                  </Button>
                </div>

                {successMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    {successMessage}
                  </div>
                )}
                
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {errorMessage}
                  </div>
                )}

                <div className="text-sm text-gray-500 pt-4 border-t">
                  <p>
                    * Champs obligatoires<br />
                    Vos données personnelles sont traitées conformément à notre{' '}
                    <a href="/politique-confidentialite" className="text-primary-600 hover:underline">
                      politique de confidentialité
                    </a>.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🗺️ Nous localiser
              </h3>
              <p className="text-gray-600 mb-4">
                CIP FARO se situe au Chemin Coulée Zebsi, 97139 Les Abymes, Guadeloupe
              </p>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Carte interactive à venir<br />
                  <small>Intégration Google Maps ou OpenStreetMap</small>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}