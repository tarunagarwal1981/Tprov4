// Test script for GeoNames API
// Run with: node test-geonames-api.js

const https = require('https');

const USERNAME = 'tarunagarwal1981';
const BASE_URL = 'https://secure.geonames.org';

// Test function to make API calls
function testGeonamesAPI(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const queryParams = new URLSearchParams({
      username: USERNAME,
      ...params
    });
    
    const url = `${BASE_URL}${endpoint}?${queryParams}`;
    console.log(`\n🔍 Testing: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`📊 Response:`, JSON.stringify(jsonData, null, 2));
          resolve(jsonData);
        } catch (error) {
          console.log(`❌ Parse Error:`, error.message);
          console.log(`📄 Raw Response:`, data);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.log(`❌ Request Error:`, error.message);
      reject(error);
    });
  });
}

// Test different endpoints
async function runTests() {
  console.log('🚀 Testing GeoNames API with username:', USERNAME);
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Search for cities
    console.log('\n1️⃣ Testing city search...');
    await testGeonamesAPI('/searchJSON', {
      name_startsWith: 'Mumbai',
      maxRows: 5,
      featureClass: 'P' // Populated places
    });
    
    // Test 2: Search for Indian cities
    console.log('\n2️⃣ Testing Indian cities search...');
    await testGeonamesAPI('/searchJSON', {
      name_startsWith: 'Delhi',
      country: 'IN',
      maxRows: 3,
      featureClass: 'P'
    });
    
    // Test 3: Get country info
    console.log('\n3️⃣ Testing country info...');
    await testGeonamesAPI('/countryInfoJSON', {
      country: 'IN'
    });
    
    // Test 4: Search with coordinates
    console.log('\n4️⃣ Testing coordinate search...');
    await testGeonamesAPI('/searchJSON', {
      north: 19.5,
      south: 19.0,
      east: 73.0,
      west: 72.5,
      maxRows: 3,
      featureClass: 'P'
    });
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Add your username to .env.local: NEXT_PUBLIC_GEONAMES_API_KEY=tarunagarwal1981');
    console.log('2. Test the location components in your React app');
    console.log('3. Check the browser console for any errors');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify your username is correct: tarunagarwal1981');
    console.log('2. Check if you have exceeded the free tier limit (1000 requests/hour)');
    console.log('3. Ensure you have an active internet connection');
    console.log('4. Try the manual tests in your browser (see instructions below)');
  }
}

// Run the tests
runTests();
