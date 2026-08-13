
const fs = require('fs');
const path = require('path');

try {
    const mainHtmlPath = path.join(__dirname, 'FuturaX · Class 6 · Chapter 2 — Diversity in the Living World (All-in-One)_1.html');
    let mainHtmlContent = fs.readFileSync(mainHtmlPath, 'utf-8');

    const startIndex = mainHtmlContent.indexOf('var PAGE_B64=');
    if (startIndex === -1) {
        throw new Error('Could not find PAGE_B64 variable.');
    }

    const openBraceIndex = mainHtmlContent.indexOf('{', startIndex);
    let braceDepth = 1;
    let finalCloseBraceIndex = openBraceIndex + 1;
    while (braceDepth > 0 && finalCloseBraceIndex < mainHtmlContent.length) {
        if (mainHtmlContent[finalCloseBraceIndex] === '{') {
            braceDepth++;
        } else if (mainHtmlContent[finalCloseBraceIndex] === '}') {
            braceDepth--;
        }
        finalCloseBraceIndex++;
    }
    
    if (braceDepth !== 0) {
        const semiColonIndex = mainHtmlContent.indexOf(';', openBraceIndex);
        if (semiColonIndex !== -1) {
            finalCloseBraceIndex = semiColonIndex;
        } else {
            throw new Error('Could not find end of PAGE_B64 object.');
        }
    }


    const pageB64ObjectString = mainHtmlContent.substring(openBraceIndex, finalCloseBraceIndex);
    const page1Match = pageB64ObjectString.match(/['"]1['"]\s*:\s*['"]([^'"]+)['"]/);

    let originalBase64Content;
    if (page1Match && page1Match[1]) {
        originalBase64Content = page1Match[1];
        console.log('Found content for activity 1.');
    } else {
        throw new Error('Could not find content for activity 1.');
    }

    let decodedHtml = Buffer.from(originalBase64Content, 'base64').toString('utf-8');

    // --- Apply Theme modifications ---
    const darkTheme = /:root\s*\{\s*--bg:#0b1020;--bg-raised:#111730;--bg-card:#151c38;\s*--ink:#e8ebff;--ink-dim:#9aa3c7;--ink-faint:#5f6890;/;
    const lightTheme = `:root{--bg: #f0f2f5;--bg-raised: #ffffff;--bg-card: #ffffff;--ink: #1c1e21;--ink-dim: #606770;--ink-faint: #8a8d91;`;

    decodedHtml = decodedHtml.replace(darkTheme, lightTheme);

    const newBase64Content = Buffer.from(decodedHtml).toString('base64');
    const oldEntry = `'"1": "${originalBase64Content}"'`;
    const newEntry = `'"1": "${newBase64Content}"'`;
    
    // Create a new PAGE_B64 object string with the updated content
    const updatedPageB64ObjectString = pageB64ObjectString.replace(page1Match[1], newBase64Content);

    // Replace the entire PAGE_B64 object in the main HTML
    mainHtmlContent = mainHtmlContent.replace(pageB64ObjectString, updatedPageB64ObjectString);

    fs.writeFileSync(mainHtmlPath, mainHtmlContent);

    console.log('Successfully updated base64 content for activity 1 in main HTML file with the new theme.');
    fs.writeFileSync(path.join(__dirname, 'decoded_activity.html'), decodedHtml);


} catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
}
