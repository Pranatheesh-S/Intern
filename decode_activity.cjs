
const fs = require('fs');

fs.readFile('chapter2_all_in_one.html', 'utf8', (err, htmlContent) => {
    if (err) {
        console.error(err);
        return;
    }

    const match = htmlContent.match(/var PAGE_B64={"0": "([^"]+)"/);
    if (match && match[1]) {
        const base64String = match[1];
        const decodedHtml = Buffer.from(base64String, 'base64').toString('utf-8');
        fs.writeFile('decoded_activity.html', decodedHtml, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Decoded HTML saved to decoded_activity.html');
        });
    } else {
        console.log("Could not find the base64 string for PAGE_B64['0']");
    }
});
