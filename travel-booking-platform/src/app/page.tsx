import { PackageCard } from '@/components/PackageCard';
import { UserProfileCard } from '@/components/UserProfileCard';
import { PricingDisplay } from '@/components/PricingDisplay';
import { 
  Package, 
  PackageType, 
  PackageStatus, 
  DifficultyLevel, 
  User, 
  UserRole,
  PackagePricing,
  GroupDiscount,
  SeasonalPricing,
  TaxBreakdown,
  FeeBreakdown,
  PackageDuration,
  GroupSize
} from '@/lib/types';

// Sample data for demonstration
const samplePackage: Package = {
  id: '1',
  tourOperatorId: 'op-1',
  title: 'Bali Adventure Package',
  description: 'Experience the beauty of Bali with our comprehensive adventure package including cultural tours, beach activities, and mountain hiking.',
  type: PackageType.LAND_PACKAGE,
  status: PackageStatus.ACTIVE,
  pricing: {
    basePrice: 1299,
    currency: 'USD',
    pricePerPerson: true,
    groupDiscounts: [
      { minGroupSize: 4, maxGroupSize: 8, discountPercentage: 10 },
      { minGroupSize: 9, discountPercentage: 15 }
    ],
    seasonalPricing: [
      { season: 'Peak Season', startDate: new Date('2024-06-01'), endDate: new Date('2024-08-31'), priceMultiplier: 1.3, reason: 'High demand period' },
      { season: 'Low Season', startDate: new Date('2024-11-01'), endDate: new Date('2024-02-28'), priceMultiplier: 0.8, reason: 'Off-peak period' }
    ],
    inclusions: [],
    taxes: {
      gst: 50,
      serviceTax: 25,
      tourismTax: 15,
      other: []
    },
    fees: {
      bookingFee: 30,
      processingFee: 20,
      cancellationFee: 100,
      other: []
    }
  } as PackagePricing,
  itinerary: [],
  inclusions: ['Accommodation', 'Meals', 'Transportation', 'Guide'],
  exclusions: ['Flights', 'Personal expenses', 'Travel insurance'],
  termsAndConditions: ['Valid for 6 months', 'Non-refundable'],
  cancellationPolicy: {
    freeCancellationDays: 7,
    cancellationFees: [],
    refundPolicy: {
      refundable: true,
      refundPercentage: 80,
      processingDays: 14,
      conditions: []
    },
    forceMajeurePolicy: 'Full refund in case of natural disasters'
  },
  images: [],
  destinations: [],
  duration: { days: 7, nights: 6 } as PackageDuration,
  groupSize: { min: 2, max: 12, ideal: 6 } as GroupSize,
  difficulty: DifficultyLevel.MODERATE,
  tags: ['adventure', 'culture', 'beach', 'mountains'],
  isFeatured: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const sampleUser: User = {
  id: '1',
  email: 'john.doe@travelagency.com',
  name: 'John Doe',
  role: UserRole.TRAVEL_AGENT,
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-555-0123',
    bio: 'Experienced travel agent specializing in adventure tours and cultural experiences.',
    address: {
      street: '123 Travel Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001'
    }
  },
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date(),
  isActive: true,
  lastLoginAt: new Date()
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Travel Booking Platform</h1>
              <p className="text-gray-600 mt-1">Design System Showcase</p>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-secondary">Sign In</button>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Design System Overview */}
        <section className="mb-12">
          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-gray-900">Design System Overview</h2>
              <p className="text-gray-600 mt-2">
                A comprehensive design system built with CSS custom properties, modern typography, and reusable components.
              </p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-blue-800">CSS Variables</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">15+</div>
                  <div className="text-sm text-green-800">Component Classes</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-purple-800">Animation Utilities</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-orange-800">TypeScript Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Button Showcase */}
        <section className="mb-12">
          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-gray-900">Button Components</h2>
              <p className="text-gray-600 mt-2">Various button styles and sizes using the design system.</p>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Button Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="btn btn-primary">Primary</button>
                    <button className="btn btn-secondary">Secondary</button>
                    <button className="btn btn-success">Success</button>
                    <button className="btn btn-warning">Warning</button>
                    <button className="btn btn-error">Error</button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Button Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="btn btn-primary btn-sm">Small</button>
                    <button className="btn btn-primary">Default</button>
                    <button className="btn btn-primary btn-lg">Large</button>
                    <button className="btn btn-primary btn-xl">Extra Large</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Showcase */}
        <section className="mb-12">
          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-gray-900">Component Examples</h2>
              <p className="text-gray-600 mt-2">Real-world components built with the design system.</p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PackageCard package={samplePackage} />
                <UserProfileCard user={sampleUser} />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Component */}
        <section className="mb-12">
          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-gray-900">Pricing Display</h2>
              <p className="text-gray-600 mt-2">Interactive pricing component with breakdown details.</p>
            </div>
            <div className="card-body">
              <div className="max-w-md mx-auto">
                <PricingDisplay pricing={samplePackage.pricing} showBreakdown={true} />
              </div>
            </div>
          </div>
        </section>

        {/* Animation Showcase */}
        <section className="mb-12">
          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-gray-900">Animation Utilities</h2>
              <p className="text-gray-600 mt-2">Smooth animations and transitions for enhanced user experience.</p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card card-flat animate-fade-in">
                  <div className="card-body text-center">
                    <div className="text-2xl mb-2">✨</div>
                    <h3 className="font-semibold">Fade In</h3>
                    <p className="text-sm text-gray-600">Smooth opacity transition</p>
                  </div>
                </div>
                <div className="card card-flat animate-slide-up">
                  <div className="card-body text-center">
                    <div className="text-2xl mb-2">⬆️</div>
                    <h3 className="font-semibold">Slide Up</h3>
                    <p className="text-sm text-gray-600">Upward slide animation</p>
                  </div>
                </div>
                <div className="card card-flat animate-scale-in">
                  <div className="card-body text-center">
                    <div className="text-2xl mb-2">🔍</div>
                    <h3 className="font-semibold">Scale In</h3>
                    <p className="text-sm text-gray-600">Scale transform effect</p>
                  </div>
                </div>
                <div className="card card-flat animate-bounce">
                  <div className="card-body text-center">
                    <div className="text-2xl mb-2">🏀</div>
                    <h3 className="font-semibold">Bounce</h3>
                    <p className="text-sm text-gray-600">Continuous bounce effect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Showcase */}
        <section className="mb-12">
          <div className="card">
            <div className="card-header">
              <h2 className="text-2xl font-bold text-gray-900">Typography System</h2>
              <p className="text-gray-600 mt-2">Consistent typography scale using Inter font family.</p>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <h1 className="text-7xl font-black text-gray-900">Heading 1</h1>
                  <p className="text-sm text-gray-500">text-7xl font-black</p>
                </div>
                <div>
                  <h2 className="text-5xl font-bold text-gray-900">Heading 2</h2>
                  <p className="text-sm text-gray-500">text-5xl font-bold</p>
                </div>
                <div>
                  <h3 className="text-3xl font-semibold text-gray-900">Heading 3</h3>
                  <p className="text-sm text-gray-500">text-3xl font-semibold</p>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-900">Heading 4</h4>
                  <p className="text-sm text-gray-500">text-xl font-medium</p>
                </div>
                <div>
                  <p className="text-base text-gray-700">Body text with normal weight and comfortable line height for optimal readability.</p>
                  <p className="text-sm text-gray-500">text-base (default)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Small text for captions and secondary information.</p>
                  <p className="text-sm text-gray-500">text-sm</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Travel Booking Platform</h3>
            <p className="text-gray-400">Built with Next.js 14, TypeScript, and a comprehensive design system.</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className="btn btn-secondary">Documentation</button>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
