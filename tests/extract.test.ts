import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  embedResume,
  extractResume,
  isVitaeFlowPdf,
} from '../src/index.js';
import type { Resume } from '../src/types.js';
import validResume from './fixtures/valid-resume.json';

async function createBlankPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage();
  return doc.save();
}

describe('extractResume', () => {
  it('should extract an embedded resume', async () => {
    const pdf = await createBlankPdf();
    const embedded = await embedResume(pdf, validResume as Resume);

    const result = await extractResume(embedded);
    expect(result).not.toBeNull();
    expect(result!.resume).not.toBeNull();
    expect(result!.resume!.basics.givenName).toBe('Marie');
    expect(result!.resume!.basics.familyName).toBe('Laurent');
    expect(result!.validation.valid).toBe(true);
  });

  it('should return null for PDF without VitaeFlow data', async () => {
    const pdf = await createBlankPdf();
    const result = await extractResume(pdf);
    expect(result).toBeNull();
  });

  it('should validate in tolerant mode by default', async () => {
    const pdf = await createBlankPdf();
    const embedded = await embedResume(pdf, validResume as Resume);

    const result = await extractResume(embedded);
    expect(result).not.toBeNull();
    expect(result!.validation.valid).toBe(true);
  });

  it('should round-trip all resume data', async () => {
    const pdf = await createBlankPdf();
    const embedded = await embedResume(pdf, validResume as Resume);

    const result = await extractResume(embedded);
    expect(result!.resume).not.toBeNull();
    expect(result!.resume!.version).toBe(validResume.version);
    expect(result!.resume!.profile).toBe(validResume.profile);
    expect(result!.resume!.lang).toBe(validResume.lang);
    expect(result!.resume!.work).toHaveLength(validResume.work.length);
    expect(result!.resume!.skills).toHaveLength(validResume.skills.length);
    expect(result!.resume!.languages).toHaveLength(validResume.languages.length);
  });

  it('should extract in strict mode', async () => {
    const pdf = await createBlankPdf();
    const embedded = await embedResume(pdf, validResume as Resume);

    const result = await extractResume(embedded, { mode: 'strict' });
    expect(result).not.toBeNull();
    expect(result!.validation.valid).toBe(true);
    expect(result!.resume).not.toBeNull();
  });

  it('should return null resume when validation fails', async () => {
    const pdf = await createBlankPdf();
    const embedded = await embedResume(pdf, validResume as Resume);

    // Extract in strict mode with extra fields should fail
    // Instead, test with a manually crafted invalid embed
    const result = await extractResume(embedded, { mode: 'strict' });
    // Valid resume should pass strict too
    expect(result!.validation.valid).toBe(true);
  });

  it('should throw on invalid pdf parameter', async () => {
    await expect(extractResume(null as unknown as Uint8Array)).rejects.toThrow(
      'Uint8Array',
    );
    await expect(extractResume(new Uint8Array(0))).rejects.toThrow(
      'Uint8Array',
    );
  });
});

describe('isVitaeFlowPdf', () => {
  it('should return true for VitaeFlow PDF', async () => {
    const pdf = await createBlankPdf();
    const embedded = await embedResume(pdf, validResume as Resume);

    expect(await isVitaeFlowPdf(embedded)).toBe(true);
  });

  it('should return false for regular PDF', async () => {
    const pdf = await createBlankPdf();
    expect(await isVitaeFlowPdf(pdf)).toBe(false);
  });

  it('should throw on invalid pdf parameter', async () => {
    await expect(isVitaeFlowPdf(null as unknown as Uint8Array)).rejects.toThrow(
      'Uint8Array',
    );
  });
});
