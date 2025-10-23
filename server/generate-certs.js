const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create certs directory if it doesn't exist
const certsDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

console.log('🔐 Generating SSL certificates for development...');

try {
  // Generate private key
  execSync('openssl genrsa -out certs/private-key.pem 2048', { stdio: 'inherit' });
  
  // Generate certificate signing request
  execSync('openssl req -new -key certs/private-key.pem -out certs/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"', { stdio: 'inherit' });
  
  // Generate self-signed certificate
  execSync('openssl x509 -req -in certs/certificate.csr -signkey certs/private-key.pem -out certs/certificate.pem -days 365', { stdio: 'inherit' });
  
  // Clean up CSR file
  fs.unlinkSync('certs/certificate.csr');
  
  console.log('✅ SSL certificates generated successfully!');
  console.log('📁 Certificates saved in: certs/');
  console.log('🔒 You can now run the server with HTTPS support');
  
} catch (error) {
  console.error('❌ Error generating certificates:', error.message);
  console.log('💡 Make sure OpenSSL is installed on your system');
  console.log('💡 On Windows, you can install OpenSSL via:');
  console.log('   - Chocolatey: choco install openssl');
  console.log('   - Or download from: https://slproweb.com/products/Win32OpenSSL.html');
}
