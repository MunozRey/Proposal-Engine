import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { exportHtml } from './exportHtml.js';

describe('exportHtml', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalCreateElement = document.createElement;
  const originalAppendChild = document.body.appendChild;
  const originalRemoveChild = document.body.removeChild;

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
  });

  it('downloads a self-contained html file', () => {
    const click = vi.fn();
    const anchor = { href: '', download: '', click };

    document.createElement = vi.fn((tag) => {
      if (tag === 'a') return anchor;
      return originalCreateElement.call(document, tag);
    });
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();

    exportHtml(
      [
        { id: 'cover', html: '<div style="color:red">Cover</div>' },
        { id: 'pricing', html: '<div>Pricing</div>' },
      ],
      'ACME Corp',
      'en'
    );

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(anchor.download).toMatch(/^CreditCheck_ACME Corp_/);
    expect(anchor.download.endsWith('_en.html')).toBe(true);
    expect(anchor.href).toBe('blob:mock-url');
    expect(click).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
