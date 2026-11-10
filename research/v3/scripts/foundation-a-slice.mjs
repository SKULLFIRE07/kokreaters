// Throwaway: slice a tall full-page PNG into viewable JPEG tiles. node foundation-a-slice.mjs <png> <sliceHeightCssPx> [dpr]
import sharp from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/sharp/dist/index.mjs';
const [file, sh = '1600', dprArg = '1'] = process.argv.slice(2);
const dpr = Number(dprArg);
const img = sharp(file, { limitInputPixels: false });
const { width, height } = await img.metadata();
const step = Number(sh) * dpr;
let i = 0;
for (let top = 0; top < height; top += step, i++) {
  const h = Math.min(step, height - top);
  await sharp(file, { limitInputPixels: false }).extract({ left: 0, top, width, height: h }).resize({ width: Math.min(width, dpr > 1 ? 780 : 1440) }).jpeg({ quality: 78 }).toFile(file.replace('.png', `-${String(i).padStart(2, '0')}.jpg`));
}
console.log(width, height, i, 'slices');
