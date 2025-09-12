const fs = require('fs');
const path = require('path');

// Ensure _redirects file exists in the build output
const redirectsSource = path.join(__dirname, 'public', '_redirects');
const redirectsDest = path.join(__dirname, 'out', '_redirects');

if (fs.existsSync(redirectsSource)) {
  fs.copyFileSync(redirectsSource, redirectsDest);
  console.log('✅ _redirects file copied to build output');
} else {
  console.log('⚠️  _redirects file not found in public directory');
}

// Verify the file was copied
if (fs.existsSync(redirectsDest)) {
  const content = fs.readFileSync(redirectsDest, 'utf8');
  console.log('📄 _redirects content:', content.trim());
} else {
  console.log('❌ _redirects file not found in build output');
}
