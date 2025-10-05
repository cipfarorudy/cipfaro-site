import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { apiClient } from '../services/apiClient';
import { useFormations } from '../hooks/useFormations';
import { useContactSubmit } from '../hooks/useContact';
// import { useDevisCalculation } from '../hooks/useDevis';

const ApiTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Hooks pour tester les fonctionnalités
  const { formations, loading: formationsLoading, error: formationsError } = useFormations();
  const { submit: submitContact, loading: contactLoading } = useContactSubmit();

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erreur inconnue' 
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testHealthCheck = () => runTest('health', () => apiClient.healthCheck());
  
  const testContactSubmit = () => runTest('contact', () => 
    submitContact({
      nom: 'Test User',
      email: 'test@example.com',
      objet: 'information-formation',
      message: 'Ceci est un test d\'intégration de l\'API',
    })
  );

  const testDevisCalculation = () => runTest('calculation', async () => {
    const response = await fetch('/api/devis/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'individuel',
        participants: 1,
        heures: 35,
        tva: 20,
        coutCertification: 0,
      })
    });
    return response.json();
  });

  const renderTestResult = (result: any) => {
    if (!result) return null;
    
    return (
      <div className="mt-2 p-2 rounded border">
        {result.success ? (
          <div>
            <Badge variant="success">Succès</Badge>
            <pre className="mt-2 text-xs overflow-auto max-h-32">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div>
            <Badge variant="error">Erreur</Badge>
            <p className="mt-2 text-red-600 text-sm">{result.error}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test d'Intégration API</h1>
      
      <div className="grid gap-6">
        {/* Test API Health */}
        <Card>
          <CardHeader>
            <CardTitle>🏥 Test de Santé API</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testHealthCheck}
              disabled={loading.health}
            >
              {loading.health ? 'Test en cours...' : 'Tester Health Check'}
            </Button>
            {renderTestResult(testResults.health)}
          </CardContent>
        </Card>

        {/* Test Formations */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Test Formations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">État du chargement:</h4>
                <Badge variant={formationsLoading ? "outline" : "success"}>
                  {formationsLoading ? "Chargement..." : "Chargé"}
                </Badge>
                {formationsError && (
                  <Badge variant="error" className="ml-2">
                    Erreur: {formationsError}
                  </Badge>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold">Formations trouvées:</h4>
                <p>{formations.length} formation(s)</p>
                {formations.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Première formation:</h5>
                    <p className="text-sm text-gray-600">{formations[0].titre}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Test Contact */}
        <Card>
          <CardHeader>
            <CardTitle>📧 Test Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testContactSubmit}
              disabled={contactLoading}
            >
              {contactLoading ? 'Envoi en cours...' : 'Tester Envoi Contact'}
            </Button>
            {renderTestResult(testResults.contact)}
          </CardContent>
        </Card>

        {/* Test Calcul Devis */}
        <Card>
          <CardHeader>
            <CardTitle>💰 Test Calcul Devis</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testDevisCalculation}
              disabled={loading.calculation}
            >
              {loading.calculation ? 'Calcul en cours...' : 'Tester Calcul Devis'}
            </Button>
            {renderTestResult(testResults.calculation)}
          </CardContent>
        </Card>

        {/* Informations de Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>API URL:</strong> {(import.meta as any)?.env?.VITE_API_URL || 'http://localhost:3001/api'}
              </div>
              <div>
                <strong>Environment:</strong> {(import.meta as any)?.env?.MODE || 'development'}
              </div>
              <div>
                <strong>Frontend:</strong> http://localhost:5174
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiTestPage;