const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makePng(width, height, isMaskable = false) {
  // Row filter 0 followed by 4 bytes (RGBA) per pixel
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient (Deep cosmic navy to violet)
      const grad = y / height;
      let r = Math.floor(7 + grad * 35);
      let g = Math.floor(10 + grad * 15);
      let b = Math.floor(20 + grad * 60);
      let a = 255;

      // Outer glow orb
      if (dist < radius) {
        const factor = 1 - dist / radius;
        r = Math.min(255, Math.floor(r + 120 * factor));
        g = Math.min(255, Math.floor(g + 70 * factor));
        b = Math.min(255, Math.floor(b + 220 * factor));
      }

      // Sparkle Core shape (4-point star)
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      const starRadius = width * 0.22;
      const inStar = (ax * ay <= starRadius * starRadius * 0.05) && (ax + ay < starRadius * 1.4);

      if (inStar) {
        // Bright cyan/white star
        r = 34;
        g = 211;
        b = 238;
        if (dist < starRadius * 0.4) {
          r = 255;
          g = 255;
          b = 255;
        }
      }

      // Small secondary sparkles
      const dx2 = Math.abs(x - (cx + width * 0.18));
      const dy2 = Math.abs(y - (cy - height * 0.18));
      if (dx2 + dy2 < width * 0.04) {
        r = 168;
        g = 85;
        b = 247;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // PNG Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = Buffer.alloc(4 + 4 + 13 + 4);
  ihdrChunk.writeUInt32BE(13, 0);
  ihdrChunk.write('IHDR', 4);
  ihdrData.copy(ihdrChunk, 8);
  const ihdrCrc = crc32(ihdrChunk.subarray(4, 21));
  ihdrChunk.writeUInt32BE(ihdrCrc, 21);

  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = Buffer.alloc(4 + 4 + compressed.length + 4);
  idatChunk.writeUInt32BE(compressed.length, 0);
  idatChunk.write('IDAT', 4);
  compressed.copy(idatChunk, 8);
  const idatCrc = crc32(idatChunk.subarray(4, 8 + compressed.length));
  idatChunk.writeUInt32BE(idatCrc, 8 + compressed.length);

  // IEND chunk
  const iendChunk = Buffer.alloc(12);
  iendChunk.writeUInt32BE(0, 0);
  iendChunk.write('IEND', 4);
  const iendCrc = crc32(iendChunk.subarray(4, 8));
  iendChunk.writeUInt32BE(iendCrc, 8);

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating EduVerse AI PWA icons...');
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), makePng(192, 192, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), makePng(512, 512, false));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), makePng(192, 192, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), makePng(512, 512, true));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), makePng(180, 180, false));
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), makePng(48, 48, false));
console.log('PWA icons successfully generated in public/icons/ and public/favicon.ico');
