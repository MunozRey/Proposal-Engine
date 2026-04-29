// PDF export pipeline (raster path).
// Improvements over the previous version:
//  - 4x render scale (was 2x) → text and edges are much sharper at print size
//  - PNG output (was JPEG q=0.93) → no chroma blocking on text or sharp colours
//  - Awaits document.fonts.ready and forces a layout pass before capture
//    so Inter / Inter Tight / IBM Plex Sans actually render embedded
//  - Pre-resizes oversized raster logos before inlining to keep the file small

const A4_W_PT = 595.28;
const A4_H_PT = 841.89;
const RENDER_SCALE = 4;
const RENDER_W_PX = 595; // CSS pixels of the page divs
const RENDER_H_PX = 842;
const MAX_LOGO_PX = 600; // resize raster images larger than this before embedding

async function fetchAsBlob(url) {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function dataUrlFromUrl(url) {
  if (!url || url.startsWith('data:')) return url;
  const blob = await fetchAsBlob(url);
  return blobToDataUrl(blob);
}

/** Pre-resize a raster image data URL to maxSide px (largest dimension). */
async function shrinkDataUrl(dataUrl, maxSide = MAX_LOGO_PX) {
  if (!dataUrl?.startsWith('data:image/')) return dataUrl;
  if (dataUrl.startsWith('data:image/svg')) return dataUrl; // keep SVG vector
  const img = await loadImage(dataUrl);
  if (img.naturalWidth <= maxSide && img.naturalHeight <= maxSide) return dataUrl;
  const ratio = maxSide / Math.max(img.naturalWidth, img.naturalHeight);
  const w = Math.round(img.naturalWidth * ratio);
  const h = Math.round(img.naturalHeight * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/png');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Inline + optimize all <img> sources in a container. */
async function inlineImages(container) {
  const imgs = [...container.querySelectorAll('img')];
  await Promise.all(
    imgs.map(async (img) => {
      img.removeAttribute('crossorigin');
      const src = img.src;
      if (!src) return;
      try {
        const data = src.startsWith('data:') ? src : await dataUrlFromUrl(src);
        img.src = await shrinkDataUrl(data);
      } catch {
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      }
    })
  );
}

/** Wait for fonts and any pending layout. */
async function waitForFonts() {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }
  // One animation frame so the browser flushes any newly-loaded glyphs into layout.
  await new Promise((r) => requestAnimationFrame(r));
}

export async function exportPDF(pages, clientName, language = 'en') {
  const isEs = language === 'es';
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const total = pages.length;
  const overlay = createOverlay(isEs, total);
  document.body.appendChild(overlay.root);

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;top:0;left:0;width:${RENDER_W_PX}px;height:${RENDER_H_PX}px;overflow:hidden;z-index:99998;pointer-events:none`;
  document.body.appendChild(container);

  await waitForFonts();

  const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true });

  try {
    for (let i = 0; i < total; i++) {
      const pct = Math.round(((i + 0.5) / total) * 100);
      overlay.setStatus(
        isEs ? `Renderizando página ${i + 1} de ${total}…` : `Rendering page ${i + 1} of ${total}…`
      );
      overlay.setProgress(pct, i + 1, total);

      const pageDiv = document.createElement('div');
      pageDiv.style.cssText = `width:${RENDER_W_PX}px;height:${RENDER_H_PX}px;overflow:hidden`;
      pageDiv.innerHTML = pages[i].html;
      container.appendChild(pageDiv);

      await inlineImages(pageDiv);
      // Force a font / layout pass per page after image swaps.
      await waitForFonts();

      const canvas = await html2canvas(pageDiv, {
        scale: RENDER_SCALE,
        useCORS: true,
        allowTaint: false,
        width: RENDER_W_PX,
        height: RENDER_H_PX,
        windowWidth: RENDER_W_PX,
        windowHeight: RENDER_H_PX,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        backgroundColor: null,
      });

      container.removeChild(pageDiv);

      if (i > 0) pdf.addPage();
      // PNG keeps text crisp at print size; jsPDF compresses it on save.
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, A4_W_PT, A4_H_PT, '', 'FAST');
    }

    overlay.setProgress(100, total, total);
    overlay.setStatus(isEs ? 'Guardando archivo…' : 'Saving file…');

    const safeName = (clientName || 'Proposal').replace(/[^a-zA-Z0-9À-ÿ _-]/g, '').trim();
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    pdf.save(`CreditCheck_${safeName}_${dateStr}_${language}.pdf`);
  } finally {
    document.body.removeChild(container);
    document.body.removeChild(overlay.root);
  }
}

function createOverlay(isEs, total) {
  const root = document.createElement('div');
  root.style.cssText = `
    position:fixed;inset:0;z-index:99999;
    background:linear-gradient(160deg, rgba(10,18,100,.95) 0%, rgba(7,8,59,.96) 100%);
    display:flex;align-items:center;justify-content:center;
    font-family:'IBM Plex Sans','Inter','Segoe UI',sans-serif;
    color:#fff;flex-direction:column;gap:18px;backdrop-filter:blur(8px);
  `;
  root.innerHTML = `
    <div style="font-family:'Larken','IBM Plex Serif',Georgia,serif;font-size:24px;font-weight:600;letter-spacing:-0.02em">CreditCheck</div>
    <div id="pdf-status" style="font-size:13px;color:rgba(255,255,255,.78)">${isEs ? 'Preparando…' : 'Preparing…'}</div>
    <div style="width:280px;height:5px;background:rgba(255,255,255,.10);border-radius:9999px;overflow:hidden">
      <div id="pdf-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#005EFF,#FFCC00);border-radius:9999px;transition:width .35s cubic-bezier(.16,1,.3,1)"></div>
    </div>
    <div id="pdf-count" style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:rgba(255,255,255,.5);letter-spacing:0.06em">0 / ${total}</div>
  `;
  const statusEl = root.querySelector('#pdf-status');
  const barEl = root.querySelector('#pdf-bar');
  const countEl = root.querySelector('#pdf-count');
  return {
    root,
    setStatus(msg) {
      statusEl.textContent = msg;
    },
    setProgress(pct, current, max) {
      barEl.style.width = pct + '%';
      countEl.textContent = `${current} / ${max}`;
    },
  };
}
