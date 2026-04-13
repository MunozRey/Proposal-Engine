/** Fetch an external URL and return it as a data URL */
async function toDataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Replace every external <img> src with a data URL so html2canvas can draw them */
async function inlineImages(container) {
  const imgs = [...container.querySelectorAll('img')];
  await Promise.all(imgs.map(async (img) => {
    img.removeAttribute('crossorigin');
    const src = img.src;
    if (!src || src.startsWith('data:')) return;
    try {
      img.src = await toDataUrl(src);
    } catch {
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
  }));
}

export async function exportPDF(pages, clientName) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const total = pages.length;

  // ── Overlay with progress bar ──
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:99999;
    background:rgba(11,29,58,.94);
    display:flex;align-items:center;justify-content:center;
    font-family:'Segoe UI',sans-serif;color:#fff;font-size:14px;font-weight:600;
    letter-spacing:.03em;flex-direction:column;gap:14px;
  `;
  overlay.innerHTML = `
    <div style="font-size:28px">📄</div>
    <div id="pdf-status">Preparing…</div>
    <div style="width:220px;height:6px;background:rgba(255,255,255,.15);border-radius:3px;overflow:hidden">
      <div id="pdf-bar" style="width:0%;height:100%;background:#1858F5;border-radius:3px;transition:width .3s ease"></div>
    </div>
    <div id="pdf-count" style="font-size:11px;color:rgba(255,255,255,.5)">0 / ${total}</div>
  `;
  document.body.appendChild(overlay);

  const statusEl = overlay.querySelector('#pdf-status');
  const barEl = overlay.querySelector('#pdf-bar');
  const countEl = overlay.querySelector('#pdf-count');

  // ── Render container ──
  const container = document.createElement('div');
  container.style.cssText = `
    position:fixed;top:0;left:0;width:595px;height:842px;
    overflow:hidden;z-index:99998;pointer-events:none;
  `;
  document.body.appendChild(container);

  const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true });

  try {
    for (let i = 0; i < total; i++) {
      const pct = Math.round(((i + 0.5) / total) * 100);
      statusEl.textContent = `Rendering page ${i + 1} of ${total}…`;
      barEl.style.width = pct + '%';
      countEl.textContent = `${i + 1} / ${total}`;

      const pageDiv = document.createElement('div');
      pageDiv.style.cssText = 'width:595px;height:842px;overflow:hidden;';
      pageDiv.innerHTML = pages[i].html;
      container.appendChild(pageDiv);

      await inlineImages(pageDiv);

      const canvas = await html2canvas(pageDiv, {
        scale: 2,
        useCORS: false,
        allowTaint: false,
        width: 595,
        height: 842,
        windowWidth: 595,
        windowHeight: 842,
        x: 0, y: 0, scrollX: 0, scrollY: 0,
        logging: false,
        backgroundColor: null,
      });

      container.removeChild(pageDiv);

      if (i > 0) pdf.addPage();
      const imgData = canvas.toDataURL('image/jpeg', 0.93);
      pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89, '', 'FAST');
    }

    barEl.style.width = '100%';
    statusEl.textContent = 'Saving file…';

    // Filename with date: CreditCheck_Ebury_2026-03.pdf
    const safeName = (clientName || 'Proposal').replace(/[^a-zA-Z0-9À-ÿ _-]/g, '').trim();
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    pdf.save(`CreditCheck_${safeName}_${dateStr}.pdf`);
  } finally {
    document.body.removeChild(container);
    document.body.removeChild(overlay);
  }
}
