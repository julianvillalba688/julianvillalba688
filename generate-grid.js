const fs = require('fs');
const sharp = require('sharp');

async function main() {
    const COLS = 52;
    const ROWS = 35;
    const CELL_SIZE = 10;
    const CELL_GAP = 3;

    // 1. Lee tu imagen (ej. mr-robot.png), la redimensiona a 52x35 y la convierte a escala de grises
    const { data } = await sharp('mr-robot.png')
        .resize(COLS, ROWS, { fit: 'fill' })
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    let rects = '';

    // 2. Recorre cada píxel procesado
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const idx = r * COLS + c;
            const pixelValue = data[idx]; // Valor de 0 (negro) a 255 (blanco)

            const x = c * (CELL_SIZE + CELL_GAP);
            const y = r * (CELL_SIZE + CELL_GAP);

            // Si el píxel es claro/blanco, enciende el cuadro verde de GitHub
            const isLit = pixelValue > 128;
            const color = isLit ? '#39d353' : '#161b22';

            // Añade el cuadro con retraso de animación según la posición
            rects += `  <rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" fill="${color}">
    <animate attributeName="opacity" values="0;1" dur="1.5s" begin="${(r + c) * 0.03}s" fill="freeze" />
  </rect>\n`;
        }
    }

    const width = COLS * (CELL_SIZE + CELL_GAP);
    const height = ROWS * (CELL_SIZE + CELL_GAP);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#0d1117" rx="6"/>
  <g transform="translate(5, 5)">
${rects}  </g>
</svg>`;

    fs.mkdirSync('dist', { recursive: true });
    fs.writeFileSync('dist/mr-robot-grid.svg', svg);
    console.log('SVG generado con éxito en dist/mr-robot-grid.svg');
}

main().catch(console.error);