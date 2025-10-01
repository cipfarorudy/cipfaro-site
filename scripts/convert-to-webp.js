import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, "..", "src", "assets");

async function convert(file) {
  const input = path.join(assetsDir, file);
  const ext = path.extname(file).toLowerCase();
  const name = path.basename(file, ext);
  const out = path.join(assetsDir, `${name}.webp`);
  try {
    await sharp(input).webp({ quality: 80 }).toFile(out);
    console.log(`Converted ${file} → ${name}.webp`);
  } catch (err) {
    console.warn(`Direct conversion failed for ${file}: ${err.message}`);
    // Fallback: try to read into a buffer and re-encode then convert
    try {
      const buffer = await fs.readFile(input);
      const intermediate = await sharp(buffer).jpeg().toBuffer();
      await sharp(intermediate).webp({ quality: 80 }).toFile(out);
      console.log(`Converted ${file} → ${name}.webp (via fallback)`);
    } catch (err2) {
      console.error(`Failed to convert ${file} (fallback):`, err2.message);
    }
  }
}

async function run() {
  try {
    const files = await fs.readdir(assetsDir);
    const images = files.filter((f) => /\.(jpe?g|png)$/i.test(f));
    await Promise.all(images.map(convert));
    console.log("All conversions done");
  } catch (err) {
    console.error("Cannot read assets dir", err.message);
    process.exit(1);
  }
}

run();
