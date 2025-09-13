'use client';

import { useState } from 'react';
import { StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, MapPin } from 'lucide-react';

export default function DestinationsStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext, 
  onPrevious 
}: StepProps) {
  const [destinations, setDestinations] = useState<string[]>(formData.destinations || []);
  const [newDestination, setNewDestination] = useState('');

  const handleAddDestination = () => {
    if (newDestination.trim() && !destinations.includes(newDestination.trim())) {
      const updated = [...destinations, newDestination.trim()];
      setDestinations(updated);
      updateFormData({ destinations: updated });
      setNewDestination('');
    }
  };

  const handleRemoveDestination = (destination: string) => {
    const updated = destinations.filter(d => d !== destination);
    setDestinations(updated);
    updateFormData({ destinations: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Destinations & Itinerary
        </h2>
        <p className="text-gray-600">
          Add destinations and create your package itinerary
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Destinations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder="Enter destination (e.g., Bali, Indonesia)"
              onKeyPress={(e) => e.key === 'Enter' && handleAddDestination()}
            />
            <Button onClick={handleAddDestination}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {destinations.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Destinations</Label>
              <div className="flex flex-wrap gap-2">
                {destinations.map((destination) => (
                  <div
                    key={destination}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{destination}</span>
                    <button
                      onClick={() => handleRemoveDestination(destination)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={destinations.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue to Pricing
        </Button>
      </div>
    </div>
  );
}
