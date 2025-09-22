// Test script for Location Service
// Run with: node test-location-service.js

const { EnhancedLocationService } = require('./src/lib/services/enhancedLocationService');

async function testLocationService() {
  console.log('🚀 Testing Enhanced Location Service...');
  console.log('=' .repeat(50));
  
  try {
    const service = EnhancedLocationService.getInstance();
    
    // Test 1: Search for cities
    console.log('\n1️⃣ Testing city search...');
    const searchResult = await service.searchLocations({
      query: 'Mumbai',
      country: 'India',
      limit: 5
    });
    console.log('✅ Search Results:', JSON.stringify(searchResult, null, 2));
    
    // Test 2: Get popular cities
    console.log('\n2️⃣ Testing popular cities...');
    const popularCities = await service.getPopularCities('India', 10);
    console.log('✅ Popular Cities:', JSON.stringify(popularCities, null, 2));
    
    // Test 3: Get countries
    console.log('\n3️⃣ Testing countries...');
    const countries = await service.getCountries();
    console.log('✅ Countries:', JSON.stringify(countries, null, 2));
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n📝 The location service is working and ready to use in your React components.');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your database is set up with the cities table');
    console.log('2. Check if the search_cities function exists in your database');
    console.log('3. Verify your Supabase connection is working');
  }
}

// Run the tests
testLocationService();
