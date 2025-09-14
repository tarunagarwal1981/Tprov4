#!/usr/bin/env node

/**
 * Simple Demo User Creation Script for Supabase
 * 
 * This script helps you create demo users in Supabase Auth
 * Run this after setting up your Supabase project
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('💡 Get these from your Supabase Dashboard → Settings → API');
  process.exit(1);
}

// Demo users to create
const demoUsers = [
  {
    email: 'admin@travelbooking.com',
    password: 'Admin123!',
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
  },
  {
    email: 'operator@adventuretravel.com',
    password: 'Operator123!',
    name: 'Sarah Johnson',
    role: 'TOUR_OPERATOR',
  },
  {
    email: 'agent@travelpro.com',
    password: 'Agent123!',
    name: 'Mike Chen',
    role: 'TRAVEL_AGENT',
  },
];

async function createDemoUsers() {
  console.log('🚀 Creating demo users in Supabase...');
  console.log('');

  for (const user of demoUsers) {
    try {
      console.log(`📝 Creating user: ${user.email}`);
      
      // Create user in Supabase Auth
      const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            name: user.name,
            role: user.role,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to create ${user.email}:`, error);
        continue;
      }

      const userData = await response.json();
      console.log(`✅ Created user: ${user.email} (ID: ${userData.id})`);
      
      // The trigger should automatically create the user profile in public.users
      // But let's verify it exists
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      });

      if (profileResponse.ok) {
        const profiles = await profileResponse.json();
        if (profiles.length > 0) {
          console.log(`✅ User profile created in public.users table`);
        } else {
          console.log(`⚠️  User profile not found in public.users table - check your trigger`);
        }
      }

    } catch (error) {
      console.error(`💥 Error creating ${user.email}:`, error.message);
    }
    
    console.log('');
  }

  console.log('🎉 Demo user creation completed!');
  console.log('');
  console.log('📋 Demo Users Created:');
  demoUsers.forEach(user => {
    console.log(`   📧 ${user.email} / ${user.password} (${user.role})`);
  });
  console.log('');
  console.log('🔗 You can now test the login flow at: http://localhost:3000/auth/login');
}

// Run the script
createDemoUsers().catch(console.error);
