const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to match OG image dimensions
  await page.setViewport({ width: 1200, height: 630 });
  
  // Navigate to the OG image route
  await page.goto('http://localhost:3000/api/og', { waitUntil: 'networkidle0' });
  
  // Take screenshot
  const screenshot = await page.screenshot({
    path: path.join(__dirname, '../public/og-image.png'),
    type: 'png',
    fullPage: false,
  });
  
  console.log('OG image generated successfully at public/og-image.png');
  
  await browser.close();
}

// Only run if this script is executed directly
if (require.main === module) {
  generateOGImage().catch(console.error);
}

module.exports = generateOGImage; 