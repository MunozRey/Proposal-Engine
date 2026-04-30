import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

function sanitizeText(value) {
  return String(value || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toParagraphs(text) {
  if (!text) return [new Paragraph({ text: '' })];
  return text
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: 120 },
        })
    );
}

export async function exportDocx(pages, clientName, language = 'en') {
  const safeName =
    (clientName || 'Proposal').replace(/[^a-zA-Z0-9À-ÿ _-]/g, '').trim() || 'Proposal';
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const children = [
    new Paragraph({
      text: 'CreditCheck Proposal',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 320 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `${safeName} · ${dateStr}`, size: 22, color: '4B5563' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 280 },
    }),
  ];

  pages.forEach((page, idx) => {
    children.push(
      new Paragraph({
        text: page.label || `Page ${idx + 1}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 220, after: 160 },
      })
    );
    const plainText = sanitizeText(page.html);
    children.push(...toParagraphs(plainText));
  });

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CreditCheck_${safeName}_${dateStr}_${language}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
