// Smoke tests for the page generators. They should each return a non-empty
// HTML string for a fully-default state without throwing. These tests guard
// against accidental regressions when refactoring shared helpers.

import { describe, it, expect } from 'vitest';
import { INIT } from '../state/initialState.js';
import { genPage1 } from './genPage1.js';
import { genPage2 } from './genPage2.js';
import { genPage3 } from './genPage3.js';
import { genWhyCC } from './genWhyCC.js';
import { genClose } from './genClose.js';
import { genLeadsOverview } from './leads/genLeadsOverview.js';
import { genLeadsCPL } from './leads/genLeadsCPL.js';
import { genLeadsCPA } from './leads/genLeadsCPA.js';
import { genLeadsHybrid } from './leads/genLeadsHybrid.js';

const PAGES = {
  cover: () => genPage1(INIT),
  howItWorks: () => genPage2(INIT, '01'),
  pricing: () => genPage3(INIT, '02'),
  whyCC: () => genWhyCC(INIT, '03'),
  close: () => genClose(INIT, '99'),
  leadsOverview: () => genLeadsOverview(INIT, '01'),
  leadsCPL: () => genLeadsCPL(INIT, '02'),
  leadsCPA: () => genLeadsCPA(INIT, '03'),
  leadsHybrid: () => genLeadsHybrid(INIT, '04'),
};

describe('page generators (smoke)', () => {
  for (const [name, fn] of Object.entries(PAGES)) {
    it(`${name} renders without throwing`, () => {
      const html = fn();
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(100);
      expect(html).toContain('<div');
    });

    it(`${name} stamps the A4 dimensions`, () => {
      const html = fn();
      expect(html).toContain('width:595px');
      expect(html).toContain('height:842px');
    });
  }

  it('cover honors the language toggle', () => {
    const en = genPage1({ ...INIT, language: 'en' });
    const es = genPage1({ ...INIT, language: 'es' });
    expect(en).toContain('CONFIDENTIAL');
    expect(es).toContain('CONFIDENCIAL');
  });

  it('pricing reflects custom plans', () => {
    const st = {
      ...INIT,
      plans: [
        {
          name: 'Test',
          price: '€1',
          per: '/mo',
          verifs: '10',
          avg: '€0.10',
          extra: '€0.50',
          rec: false,
        },
        {
          name: 'Best',
          price: '€2',
          per: '/mo',
          verifs: '20',
          avg: '€0.20',
          extra: '€0.40',
          rec: true,
        },
      ],
    };
    const html = genPage3(st, '02');
    expect(html).toContain('€1');
    expect(html).toContain('€2');
    // Recommended pill should appear at least once
    expect(html.toLowerCase()).toMatch(/most popular|recomendado/);
  });

  it('close page builds a mailto CTA with the contact email', () => {
    const st = {
      ...INIT,
      contact: { ...INIT.contact, email: 'sales@x.io' },
      clientName: 'Ebury',
    };
    const html = genClose(st, '99');
    expect(html).toContain('mailto:sales');
    expect(html).toContain('Ebury');
  });

  it('leads overview surfaces all three model accents', () => {
    const html = genLeadsOverview(INIT, '01');
    // CPL = blue, CPA = mint, Hybrid = violet
    expect(html.toUpperCase()).toContain('#005EFF');
    expect(html.toUpperCase()).toContain('#22D3A0');
    expect(html.toUpperCase()).toContain('#7C5CFF');
  });
});
