import { describe, it, expect } from 'vitest';
import {
  isVitaeFlowFilename,
  formatVitaeFlowFilename,
  VITAEFLOW_FILE_EXTENSION,
} from '../src/index.js';

describe('VITAEFLOW_FILE_EXTENSION', () => {
  it('is .vf.pdf', () => {
    expect(VITAEFLOW_FILE_EXTENSION).toBe('.vf.pdf');
  });
});

describe('isVitaeFlowFilename', () => {
  it('returns true for .vf.pdf', () => {
    expect(isVitaeFlowFilename('CV_Marie_Laurent.vf.pdf')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isVitaeFlowFilename('Resume.VF.PDF')).toBe(true);
    expect(isVitaeFlowFilename('doc.Vf.Pdf')).toBe(true);
  });

  it('returns false for plain .pdf', () => {
    expect(isVitaeFlowFilename('CV_Marie_Laurent.pdf')).toBe(false);
  });

  it('returns false for unrelated extensions', () => {
    expect(isVitaeFlowFilename('notes.txt')).toBe(false);
    expect(isVitaeFlowFilename('data.json')).toBe(false);
  });
});

describe('formatVitaeFlowFilename', () => {
  it('replaces .pdf with .vf.pdf', () => {
    expect(formatVitaeFlowFilename('CV_Toto.pdf')).toBe('CV_Toto.vf.pdf');
  });

  it('leaves .vf.pdf filenames unchanged', () => {
    expect(formatVitaeFlowFilename('CV_Toto.vf.pdf')).toBe('CV_Toto.vf.pdf');
  });

  it('handles case-insensitive .pdf', () => {
    expect(formatVitaeFlowFilename('resume.PDF')).toBe('resume.vf.pdf');
  });

  it('appends .vf.pdf if no .pdf extension', () => {
    expect(formatVitaeFlowFilename('CV_Toto')).toBe('CV_Toto.vf.pdf');
  });

  it('does not double-apply on already-correct names (case-insensitive)', () => {
    expect(formatVitaeFlowFilename('doc.VF.PDF')).toBe('doc.VF.PDF');
  });
});
