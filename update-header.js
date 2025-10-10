const fs = require('fs');
const path = require('path');

// The new header HTML to be used across all pages
const newHeader = `    <a class="sticky-donate" href="contact.html#donate">Donate Now</a>
    <header>
      <div class="container navbar">
        <a href="index.html" class="brand">
          <img src="assets/New%20images/logo.jpg" alt="Dr. WaZzz Foundation" width="44" height="44" />
          <span>Dr. WaZzz Foundation</span>
        </a>
        <nav>
          <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
            <i class="fas fa-bars"></i>
          </button>
          <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="focus-areas.html">Focus Areas</a></li>
            <li><a href="research-partnerships.html">Research & Partnerships</a></li>
            <li><a href="team.html">Our Team</a></li>
            <li><a href="impact-stories.html">Impact & Stories</a></li>
            <li><a href="contact.html">Get Involved</a></li>
          </ul>
        </nav>
      </div>
    </header>`;

// Function to update header in a single file
function updateHeaderInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the current header section (from sticky-donate to </header>)
    const headerRegex = /<a class="sticky-donate"[\s\S]*?<\/header>/i;
    
    if (content.match(headerRegex)) {
      // Replace the header section
      const updatedContent = content.replace(headerRegex, newHeader);
      
      // Set active class based on current page
      const pageName = path.basename(filePath, '.html');
      let finalContent = updatedContent;
      
      // Special case for index.html
      if (pageName === 'index') {
        finalContent = updatedContent.replace(
          '<li><a href="index.html">Home</a>',
          '<li><a class="active" href="index.html">Home</a>'
        );
      } else {
        // For other pages, set active class based on the page name
        finalContent = updatedContent.replace(
          new RegExp(`<li><a href="${pageName}.html"`, 'i'),
          '<li><a class="active" href="' + pageName + '.html"'
        );
      }
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`✅ Updated header in ${filePath}`);
    } else {
      console.log(`⚠️  No header found in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Get all HTML files in the current directory
const files = fs.readdirSync('.').filter(file => file.endsWith('.html'));

// Update header in each HTML file
files.forEach(file => {
  updateHeaderInFile(file);
});

console.log('\n🎉 Header update complete!');
