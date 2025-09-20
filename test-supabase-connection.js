// Test Supabase Connection
// Add this to your browser console to test the connection

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log('📊 Data:', data);
    return true;
  } catch (err) {
    console.error('❌ Network error:', err);
    return false;
  }
}

// Test authentication
async function testAuth() {
  console.log('🔐 Testing Authentication...');
  
  try {
    // Test with a dummy user (this will fail but should not throw network error)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    
    if (error) {
      console.log('✅ Auth endpoint reachable (expected error):', error.message);
      return true;
    }
    
    console.log('⚠️ Unexpected success:', data);
    return true;
  } catch (err) {
    console.error('❌ Auth network error:', err);
    return false;
  }
}

// Run tests
testSupabaseConnection().then(success => {
  if (success) {
    testAuth();
  }
});
