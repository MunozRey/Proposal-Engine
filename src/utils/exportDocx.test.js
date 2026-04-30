import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

const toBlobMock = vi.fn(
  async () =>
    new Blob(['docx'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
);

vi.mock('docx', () => ({
  AlignmentType: { CENTER: 'center' },
  HeadingLevel: { TITLE: 'title', HEADING_2: 'heading2' },
  TextRun: class TextRun {
    constructor(props) {
      this.props = props;
    }
  },
  Paragraph: class Paragraph {
    constructor(props) {
      this.props = props;
    }
  },
  Document: class Document {
    constructor(props) {
      this.props = props;
    }
  },
  Packer: { toBlob: toBlobMock },
}));

describe('exportDocx', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalCreateElement = document.createElement;
  const originalAppendChild = document.body.appendChild;
  const originalRemoveChild = document.body.removeChild;

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:docx-url');
    URL.revokeObjectURL = vi.fn();
    toBlobMock.mockClear();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
  });

  it('builds and downloads a docx file', async () => {
    const { exportDocx } = await import('./exportDocx.js');
    const click = vi.fn();
    const anchor = { href: '', download: '', click };

    document.createElement = vi.fn((tag) => {
      if (tag === 'a') return anchor;
      return originalCreateElement.call(document, tag);
    });
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();

    await exportDocx(
      [
        { id: 'cover', label: 'Cover', html: '<h1>Cover title</h1><p>Intro body.</p>' },
        { id: 'pricing', label: 'Pricing', html: '<p>Plan A</p><p>Plan B</p>' },
      ],
      'ACME',
      'en'
    );

    expect(toBlobMock).toHaveBeenCalledTimes(1);
    expect(anchor.download).toMatch(/^CreditCheck_ACME_/);
    expect(anchor.download.endsWith('_en.docx')).toBe(true);
    expect(anchor.href).toBe('blob:docx-url');
    expect(click).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:docx-url');
  });
});
