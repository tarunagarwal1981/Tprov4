'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  Clock,
  Eye,
  Edit,
  Send,
  CheckCircle,
  AlertCircle,
  Package,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentService } from '@/lib/services/agentService';
import { Itinerary } from '@/lib/types/agent';
import { cn } from '@/lib/utils';

// Define roles outside component to prevent re-creation on every render
const AGENT_ROLES = [UserRole.TRAVEL_AGENT];

function ItinerariesPage() {
  const { state } = useImprovedAuth();
  const [itineraries, setItineraries] = React.useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      setIsLoading(true);
      const response = await agentService.getItineraries(state.user?.id || 'agent-001');
      if (response.success) {
        setItineraries(response.data);
      }
    } catch (error) {
      console.error('Error loading itineraries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'REVISED': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'BOOKED': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <Edit className="h-4 w-4" />;
      case 'SENT': return <Send className="h-4 w-4" />;
      case 'REVISED': return <AlertCircle className="h-4 w-4" />;
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'BOOKED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <AlertCircle className="h-4 w-4" />;
      default: return <Edit className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Itineraries</h1>
                <p className="text-gray-600 mt-1">Create and manage travel itineraries for your clients</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Itinerary
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading itineraries...</p>
          </div>
        ) : itineraries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No itineraries yet</h3>
              <p className="text-gray-600 mb-6">Start by creating your first travel itinerary</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Itinerary
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {itineraries.map((itinerary) => (
              <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{itinerary.title}</CardTitle>
                    <Badge className={cn('flex items-center space-x-1', getStatusColor(itinerary.status))}>
                      {getStatusIcon(itinerary.status)}
                      <span>{itinerary.status}</span>
                    </Badge>
                  </div>
                  {itinerary.description && (
                    <p className="text-sm text-gray-600 mt-2">{itinerary.description}</p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>${itinerary.customerPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{itinerary.days.length} days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{itinerary.packages.length} packages</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{new Date(itinerary.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Commission:</span>
                      <span className="font-semibold text-green-600">${itinerary.agentCommission}</span>
                    </div>
                  </div>
                  
                  {itinerary.notes && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> {itinerary.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      Created {new Date(itinerary.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ItinerariesPageWrapper() {
  return (
    <ProtectedRoute requiredRoles={AGENT_ROLES}>
      <ItinerariesPage />
    </ProtectedRoute>
  );
}
