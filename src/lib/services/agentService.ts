// Agent-specific services for leads, itineraries, and package browsing

import { supabase } from '@/lib/supabase';
import { 
  Lead, 
  Itinerary, 
  AgentStats, 
  AgentDashboardData, 
  PackageSearchFilters,
  BookingRequest,
  Commission,
  AgentActivity,
  AgentNotification
} from '@/lib/types/agent';

// Mock delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for development
const mockLeads: Lead[] = [
  {
    id: 'lead-001',
    customerName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    destination: 'Bali, Indonesia',
    budget: 3000,
    tripType: 'ADVENTURE',
    travelers: 2,
    duration: 7,
    preferredDates: {
      start: new Date('2024-03-15'),
      end: new Date('2024-03-22')
    },
    preferences: ['Beach activities', 'Cultural experiences', 'Adventure sports'],
    status: 'NEW',
    source: 'MARKETPLACE',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    agentId: 'agent-001',
    notes: 'Interested in water sports and local cuisine',
    communicationLog: []
  },
  {
    id: 'lead-002',
    customerName: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1-555-0456',
    destination: 'Paris, France',
    budget: 5000,
    tripType: 'CULTURAL',
    travelers: 2,
    duration: 10,
    preferredDates: {
      start: new Date('2024-04-20'),
      end: new Date('2024-04-30')
    },
    preferences: ['Museums', 'Fine dining', 'Historical sites'],
    status: 'CONTACTED',
    source: 'REFERRAL',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    agentId: 'agent-001',
    notes: 'First-time visitors to Europe',
    communicationLog: []
  }
];

const mockItineraries: Itinerary[] = [
  {
    id: 'itinerary-001',
    leadId: 'lead-001',
    agentId: 'agent-001',
    title: 'Bali Adventure Package',
    description: '7-day adventure package including water sports and cultural experiences',
    status: 'DRAFT',
    totalCost: 2800,
    agentCommission: 280,
    customerPrice: 3000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    days: [],
    packages: [],
    customItems: [],
    notes: 'Waiting for client approval'
  }
];

const mockAgentStats: AgentStats = {
  totalLeads: 45,
  activeLeads: 12,
  totalItineraries: 28,
  bookedItineraries: 18,
  monthlyCommission: 8750,
  totalRevenue: 125000,
  averageRating: 4.9,
  conversionRate: 64.3,
  leadsGrowth: 12.5,
  revenueGrowth: 18.2,
  commissionGrowth: 15.8,
  ratingGrowth: 2.1
};

export class AgentService {
  // Lead Management
  async getLeads(agentId: string, filters?: { status?: string }): Promise<{ data: Lead[]; success: boolean; error?: string }> {
    try {
      await delay(500);
      
      let filteredLeads = mockLeads.filter(lead => lead.agentId === agentId);
      
      if (filters?.status) {
        filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
      }
      
      return {
        data: filteredLeads,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to fetch leads'
      };
    }
  }

  async getLeadById(leadId: string): Promise<{ data: Lead | null; success: boolean; error?: string }> {
    try {
      await delay(300);
      
      const lead = mockLeads.find(l => l.id === leadId);
      
      return {
        data: lead || null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: 'Failed to fetch lead'
      };
    }
  }

  async updateLeadStatus(leadId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      await delay(400);
      
      const leadIndex = mockLeads.findIndex(l => l.id === leadId);
      if (leadIndex !== -1) {
        mockLeads[leadIndex].status = status as any;
        mockLeads[leadIndex].updatedAt = new Date();
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update lead status'
      };
    }
  }

  // Itinerary Management
  async getItineraries(agentId: string, filters?: { status?: string }): Promise<{ data: Itinerary[]; success: boolean; error?: string }> {
    try {
      await delay(500);
      
      let filteredItineraries = mockItineraries.filter(itinerary => itinerary.agentId === agentId);
      
      if (filters?.status) {
        filteredItineraries = filteredItineraries.filter(itinerary => itinerary.status === filters.status);
      }
      
      return {
        data: filteredItineraries,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to fetch itineraries'
      };
    }
  }

  async createItinerary(leadId: string, agentId: string, itineraryData: Partial<Itinerary>): Promise<{ data: Itinerary | null; success: boolean; error?: string }> {
    try {
      await delay(600);
      
      const newItinerary: Itinerary = {
        id: `itinerary-${Date.now()}`,
        leadId,
        agentId,
        title: itineraryData.title || 'New Itinerary',
        description: itineraryData.description,
        status: 'DRAFT',
        totalCost: 0,
        agentCommission: 0,
        customerPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        days: [],
        packages: [],
        customItems: [],
        notes: itineraryData.notes
      };
      
      mockItineraries.push(newItinerary);
      
      return {
        data: newItinerary,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: 'Failed to create itinerary'
      };
    }
  }

  // Package Browsing
  async searchPackages(filters: PackageSearchFilters): Promise<{ data: any[]; success: boolean; error?: string }> {
    try {
      await delay(500);
      
      // This would integrate with the existing package service
      // For now, return mock data
      const mockPackages = [
        {
          id: 'pkg-001',
          name: 'Bali Adventure Package',
          destination: 'Bali, Indonesia',
          operatorName: 'Bali Adventures Co.',
          price: 1200,
          rating: 4.8,
          bookings: 45,
          views: 120,
          availability: true,
          imageUrl: '/images/bali-package.jpg'
        },
        {
          id: 'pkg-002',
          name: 'Paris Cultural Tour',
          destination: 'Paris, France',
          operatorName: 'Paris Tours Ltd.',
          price: 1800,
          rating: 4.6,
          bookings: 32,
          views: 95,
          availability: true,
          imageUrl: '/images/paris-package.jpg'
        }
      ];
      
      return {
        data: mockPackages,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to search packages'
      };
    }
  }

  // Dashboard Data
  async getDashboardData(agentId: string): Promise<{ data: AgentDashboardData; success: boolean; error?: string }> {
    try {
      await delay(600);
      
      const dashboardData: AgentDashboardData = {
        stats: mockAgentStats,
        recentLeads: mockLeads.slice(0, 5),
        recentItineraries: mockItineraries.slice(0, 5),
        topPackages: [
          {
            id: 'pkg-001',
            name: 'Bali Adventure Package',
            destination: 'Bali, Indonesia',
            operatorName: 'Bali Adventures Co.',
            price: 1200,
            rating: 4.8,
            bookings: 45,
            views: 120,
            availability: true
          }
        ],
        recentActivity: [
          {
            id: 'activity-001',
            type: 'LEAD_CREATED',
            title: 'New Lead Received',
            description: 'Sarah Johnson - Bali Adventure',
            timestamp: new Date('2024-01-15'),
            leadId: 'lead-001'
          }
        ],
        notifications: [
          {
            id: 'notif-001',
            type: 'LEAD_ASSIGNED',
            title: 'New Lead Assignment',
            message: 'You have been assigned a new lead for Bali adventure',
            isRead: false,
            createdAt: new Date('2024-01-15'),
            priority: 'HIGH',
            actionUrl: '/agent/leads/lead-001'
          }
        ]
      };
      
      return {
        data: dashboardData,
        success: true
      };
    } catch (error) {
      return {
        data: {
          stats: mockAgentStats,
          recentLeads: [],
          recentItineraries: [],
          topPackages: [],
          recentActivity: [],
          notifications: []
        },
        success: false,
        error: 'Failed to fetch dashboard data'
      };
    }
  }

  // Booking Requests
  async createBookingRequest(requestData: Partial<BookingRequest>): Promise<{ data: BookingRequest | null; success: boolean; error?: string }> {
    try {
      await delay(500);
      
      const newRequest: BookingRequest = {
        id: `request-${Date.now()}`,
        itineraryId: requestData.itineraryId!,
        packageId: requestData.packageId!,
        operatorId: requestData.operatorId!,
        agentId: requestData.agentId!,
        quantity: requestData.quantity || 1,
        requestedDates: requestData.requestedDates!,
        specialRequests: requestData.specialRequests,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return {
        data: newRequest,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: 'Failed to create booking request'
      };
    }
  }

  // Commission Tracking
  async getCommissions(agentId: string): Promise<{ data: Commission[]; success: boolean; error?: string }> {
    try {
      await delay(400);
      
      const mockCommissions: Commission[] = [
        {
          id: 'comm-001',
          agentId,
          itineraryId: 'itinerary-001',
          bookingId: 'booking-001',
          amount: 280,
          percentage: 10,
          status: 'APPROVED',
          createdAt: new Date('2024-01-15'),
          paidAt: new Date('2024-01-20'),
          notes: 'Bali Adventure Package commission'
        }
      ];
      
      return {
        data: mockCommissions,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to fetch commissions'
      };
    }
  }
}

// Export singleton instance
export const agentService = new AgentService();
