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

            // Si el píxel es claro/blanco, es parte de la cara.
            const isLit = pixelValue > 128;

            // Añadimos una clase condicional 'face-cell' si es parte de la cara
            const cellClass = isLit ? 'face-cell' : 'bg-cell';

            // Dibujamos el rectángulo
            rects += `  <rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" class="${cellClass}" />\n`;
        }
    }

    const width = COLS * (CELL_SIZE + CELL_GAP);
    const height = ROWS * (CELL_SIZE + CELL_GAP);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Estilos CSS para el Easter Egg -->
  <style>
    /* Estilo por defecto de las celdas */
    rect.bg-cell {
      fill: #161b22; /* Color apagado de GitHub */
      transition: fill 0.3s ease;
    }
    
    rect.face-cell {
      fill: #161b22; /* Color apagado de GitHub por defecto */
      transition: fill 0.3s ease;
    }

    /* Estilo al hacer hover sobre la cuadrícula entera */
    g#grid:hover rect.face-cell {
      fill: #39d353; /* Verde brillante al hacer hover */
    }
    
    g#grid:hover rect.bg-cell {
      fill: #161b22; /* Se mantiene igual */
    }
  </style>

  <rect width="100%" height="100%" fill="#0d1117" rx="6"/>
  <!-- Contenedor del grupo con ID #grid -->
  <g id="grid" transform="translate(5, 5)">
${rects}  </g>
</svg>`;

    fs.mkdirSync('dist', { recursive: true });
    fs.writeFileSync('dist/mr-robot-grid.svg', svg);
    console.log('SVG Easter Egg generado con éxito en dist/mr-robot-grid.svg');
}

main().catch(console.error);