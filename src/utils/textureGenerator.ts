import * as THREE from 'three';

// Cache generated textures so we don't recreate them every frame
const textureCache = new Map<string, THREE.CanvasTexture>();

export function createRoadTexture(): THREE.CanvasTexture {
  if (textureCache.has('road')) return textureCache.get('road')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base Dark Asphalt
  ctx.fillStyle = '#26282b';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle asphalt grain noise
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const val = Math.floor(25 + Math.random() * 25);
    ctx.fillStyle = `rgb(${val},${val},${val})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Outer solid white lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.lineTo(30, 512);
  ctx.moveTo(482, 0);
  ctx.lineTo(482, 512);
  ctx.stroke();

  // Double Yellow Center Median Lines
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(250, 0);
  ctx.lineTo(250, 512);
  ctx.moveTo(262, 0);
  ctx.lineTo(262, 512);
  ctx.stroke();

  // Dashed White Lane Markings
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.setLineDash([30, 25]);
  ctx.beginPath();
  ctx.moveTo(140, 0);
  ctx.lineTo(140, 512);
  ctx.moveTo(370, 0);
  ctx.lineTo(370, 512);
  ctx.stroke();

  // "EV LANE" Green Marking on shoulder lane
  ctx.setLineDash([]);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(45, 200, 70, 110);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EV', 80, 245);
  ctx.fillText('ONLY', 80, 275);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('road', texture);
  return texture;
}

export function createSolarPanelTexture(): THREE.CanvasTexture {
  if (textureCache.has('solar')) return textureCache.get('solar')!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep Metallic Photovoltaic Dark Blue Gradient
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#021027');
  grad.addColorStop(0.5, '#0b2545');
  grad.addColorStop(1, '#020c1b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Solar Cell Grid (6x6 cells per panel)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  const cellSize = 256 / 6;

  for (let i = 0; i <= 6; i++) {
    // Vertical grid lines
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, 256);
    ctx.stroke();

    // Horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(256, i * cellSize);
    ctx.stroke();
  }

  // Fine Silver Busbars (Photovoltaic Conductors)
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 6; i++) {
    const yCenter = i * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.moveTo(0, yCenter - 4);
    ctx.lineTo(256, yCenter - 4);
    ctx.moveTo(0, yCenter + 4);
    ctx.lineTo(256, yCenter + 4);
    ctx.stroke();
  }

  // Metallic Aluminum Frame Rim
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('solar', texture);
  return texture;
}

export function createGrassTexture(): THREE.CanvasTexture {
  if (textureCache.has('grass')) return textureCache.get('grass')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base Vibrant Lush Green
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 0, 512, 512);

  // Natural organic grass blades noise
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.floor(15 + Math.random() * 30);
    const g = Math.floor(120 + Math.random() * 80);
    const b = Math.floor(25 + Math.random() * 40);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, 3, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  textureCache.set('grass', texture);
  return texture;
}

export function createGlassFacadeTexture(tint: string = '#38bdf8'): THREE.CanvasTexture {
  const key = `glass_${tint}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Glass background tint
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 256);

  // Window grid matrix (8x8 windows)
  const w = 256 / 8;
  const h = 256 / 8;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isLit = Math.random() > 0.35;
      if (isLit) {
        const grad = ctx.createLinearGradient(c * w, r * h, (c + 1) * w, (r + 1) * h);
        grad.addColorStop(0, tint);
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = '#1e293b';
      }
      ctx.fillRect(c * w + 2, r * h + 2, w - 4, h - 4);
    }
  }

  // Structural Mullion Grid Lines
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(i * w, 0);
    ctx.lineTo(i * w, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * h);
    ctx.lineTo(256, i * h);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

export function createSidewalkTexture(): THREE.CanvasTexture {
  if (textureCache.has('sidewalk')) return textureCache.get('sidewalk')!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Concrete Paving
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 256, 256);

  // Paver tile grid
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  const tileSize = 32;
  for (let x = 0; x <= 256; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set('sidewalk', texture);
  return texture;
}
