import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output paths
const iconPngPath = path.join(__dirname, '../assets/icon.png');
const iconIcoPath = path.join(__dirname, '../assets/icon.ico');

async function generateIcons() {
    console.log('Generating icons...');

    try {
        // Simply copy existing icon files if they exist
        if (fs.existsSync(path.join(__dirname, '../assets/icon.png'))) {
            fs.copyFileSync(path.join(__dirname, '../assets/icon.png'), iconPngPath);
            console.log(`Copied existing PNG icon: ${iconPngPath}`);
        }

        if (fs.existsSync(path.join(__dirname, '../assets/icon.ico'))) {
            fs.copyFileSync(path.join(__dirname, '../assets/icon.ico'), iconIcoPath);
            console.log(`Copied existing ICO icon: ${iconIcoPath}`);
        }

        console.log('Icon generation completed successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();