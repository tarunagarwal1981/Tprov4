'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentService } from '@/lib/services/agentService';
import { Lead } from '@/lib/types/agent';

// Define roles outside component to prevent re-creation on every render
const AGENT_ROLES = [UserRole.TRAVEL_AGENT];

function LeadsPage() {
  const { state } = useImprovedAuth();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const response = await agentService.getLeads(state.user?.id || 'agent-001');
      if (response.success) {
        setLeads(response.data);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'QUOTED': return 'bg-purple-100 text-purple-800';
      case 'BOOKED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTripTypeIcon = (tripType: string) => {
    switch (tripType) {
      case 'ADVENTURE': return '🏔️';
      case 'CULTURAL': return '🏛️';
      case 'BEACH': return '🏖️';
      case 'CITY_BREAK': return '🏙️';
      case 'LUXURY': return '💎';
      case 'BUDGET': return '💰';
      default: return '✈️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Leads</h1>
                <p className="text-gray-600 mt-1">Manage your customer leads and opportunities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first customer lead</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Lead
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {lead.customerName.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lead.customerName}</CardTitle>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTripTypeIcon(lead.tripType)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{lead.destination}</p>
                      <p className="text-sm text-gray-500">{lead.tripType} • {lead.travelers} travelers</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>${lead.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{lead.duration} days</span>
                    </div>
                  </div>
                  
                  {lead.preferences.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Preferences:</p>
                      <div className="flex flex-wrap gap-1">
                        {lead.preferences.slice(0, 3).map((pref, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {pref}
                          </Badge>
                        ))}
                        {lead.preferences.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lead.preferences.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
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

export default function LeadsPageWrapper() {
  return (
    <ProtectedRoute requiredRoles={AGENT_ROLES}>
      <LeadsPage />
    </ProtectedRoute>
  );
}
