const Jimp = require('jimp');
const path = require('path');

async function processImage() {
    try {
        const imagePath = path.join(__dirname, 'public', 'logo.png');
        const outputPath = path.join(__dirname, 'public', 'logo-transparent.png');

        console.log(`Reading image from: ${imagePath}`);
        const image = await Jimp.read(imagePath);

        // Target Teal: #2CB78A (approx R:44, G:183, B:138)
        // We will scan for pixels that are "greenish" and "not white".

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            const alpha = this.bitmap.data[idx + 3];

            // Heuristic for the Teal Background
            // It is dominant green, but not pure white.
            // White is approx R>240, G>240, B>240.

            const isWhite = red > 230 && green > 230 && blue > 230;

            if (!isWhite) {
                // If it's not white, it's likely the background (or anti-aliasing).
                // Make it transparent.
                this.bitmap.data[idx + 3] = 0; // Set Alpha to 0
            } else {
                // It is white (the logo shape). Keep it opaque.
                // Optionally brighten it to pure white
                this.bitmap.data[idx + 0] = 255;
                this.bitmap.data[idx + 1] = 255;
                this.bitmap.data[idx + 2] = 255;
                this.bitmap.data[idx + 3] = 255;
            }
        });

        await image.writeAsync(outputPath);
        console.log(`Success! Transparent logo saved to: ${outputPath}`);

    } catch (error) {
        console.error("Error processing image:", error);
    }
}

processImage();
