// Smoke tests for the page generators. They should each return a non-empty
// HTML string for a fully-default state without throwing. These tests guard
// against accidental regressions when refactoring shared helpers.

import { describe, it, expect } from 'vitest';
import { INIT } from '../state/initialState.js';
import { genPage1 } from './genPage1.js';
import { genPage2 } from './genPage2.js';
import { genPage3 } from './genPage3.js';
import { genLeadsOverview } from './leads/genLeadsOverview.js';
import { genLeadsCPL } from './leads/genLeadsCPL.js';
import { genLeadsCPA } from './leads/genLeadsCPA.js';
import { genLeadsHybrid } from './leads/genLeadsHybrid.js';

const PAGES = {
  cover: () => genPage1(INIT),
  howItWorks: () => genPage2(INIT, '01'),
  pricing: () => genPage3(INIT, '02'),
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
    expect(en).toContain('Date');
    expect(es).toContain('Fecha');
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

  it('leads overview surfaces all three model accents using the brand palette', () => {
    const html = genLeadsOverview(INIT, '01').toUpperCase();
    // Brand-only palette: blue (CPL), yellow (CPA), navy (Hybrid).
    expect(html).toContain('#005EFF');
    expect(html).toContain('#FFCC00');
    expect(html).toContain('#0A1264');
  });
});
