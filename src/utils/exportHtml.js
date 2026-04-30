const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildHtmlDocument(pages, title) {
  const pageMarkup = pages
    .map(
      (page) => `
      <section class="proposal-page" data-page-id="${escapeHtml(page.id)}">
        ${page.html}
      </section>
    `
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body {
        margin: 0;
        padding: 24px;
        background: #edf1f7;
        font-family: Inter, "IBM Plex Sans", Arial, sans-serif;
      }
      .proposal-export-root {
        display: grid;
        gap: 24px;
        justify-content: center;
      }
      .proposal-page {
        width: ${PAGE_WIDTH}px;
        min-height: ${PAGE_HEIGHT}px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
      }
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          padding: 0;
          background: #fff;
        }
        .proposal-export-root {
          gap: 0;
        }
        .proposal-page {
          width: 210mm;
          min-height: 297mm;
          box-shadow: none;
          page-break-after: always;
          break-after: page;
        }
        .proposal-page:last-child {
          page-break-after: avoid;
          break-after: avoid;
        }
      }
    </style>
  </head>
  <body>
    <main class="proposal-export-root">
      ${pageMarkup}
    </main>
  </body>
</html>`;
}

function downloadTextFile(text, fileName, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportHtml(pages, clientName, language = 'en') {
  const safeName =
    (clientName || 'Proposal').replace(/[^a-zA-Z0-9À-ÿ _-]/g, '').trim() || 'Proposal';
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const fileName = `CreditCheck_${safeName}_${dateStr}_${language}.html`;
  const html = buildHtmlDocument(pages, `CreditCheck Proposal - ${safeName}`);
  downloadTextFile(html, fileName, 'text/html;charset=utf-8');
}
