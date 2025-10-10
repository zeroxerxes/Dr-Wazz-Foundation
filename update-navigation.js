const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
  'index.html',
  'about.html',
  'focus-areas.html',
  'research-partnerships.html',
  'team.html',
  'impact-stories.html',
  'contact.html',
  'gallery.html',
  'thank-you.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only update if navigation.js is not already included
    if (!content.includes('navigation.js')) {
      // Insert navigation.js before the closing head tag
      content = content.replace(
        /<\/head>/i,
        '    <script src="assets/js/navigation.js" defer></script>\n  </head>'
      );
      
      // Save the updated content
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`${file} already has navigation.js`);
    }
  } else {
    console.log(`${file} not found, skipping...`);
  }
});

console.log('Navigation update complete!');
