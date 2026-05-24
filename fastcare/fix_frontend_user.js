const fs = require('fs');

const files = [
  "src/app/patient/dashboard/page.jsx",
  "src/app/patient/emergency-card/page.jsx",
  "src/app/patient/profile/page.jsx",
  "src/app/patient/timeline/page.jsx",
  "src/app/patient/upload/page.jsx"
];

files.forEach(file => {
  const path = 'fastcare/' + file;
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    
    // Replace name
    content = content.replace(
      /name:\s*user\??\.fullName\s*\|\|\s*user\??\.firstName\s*\|\|\s*"Patient"/g,
      'name: user?.name || "Patient"'
    );
    
    // Replace email
    content = content.replace(
      /email:\s*user\??\.primaryEmailAddress\??\.emailAddress\s*\|\|\s*""/g,
      'email: user?.email || ""'
    );
    
    fs.writeFileSync(path, content, 'utf8');
    console.log('Updated ' + path);
  }
});
