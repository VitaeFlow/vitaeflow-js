import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { embedResume, extractResume, isVitaeFlowPdf } from '../src/index.js';
import type { Resume } from '../src/types.js';
import validResume from './fixtures/valid-resume.json';

async function createBlankPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage();
  return doc.save();
}

describe('embedResume', () => {
  it('should embed a valid resume in a PDF', async () => {
    const pdf = await createBlankPdf();
    const result = await embedResume(pdf, validResume as Resume);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(pdf.length);
  });

  it('should throw on invalid resume', async () => {
    const pdf = await createBlankPdf();
    const invalidResume = { version: '0.1', profile: 'minimal' } as Resume;

    await expect(embedResume(pdf, invalidResume)).rejects.toThrow('Invalid resume');
  });

  it('should produce a PDF detectable as VitaeFlow', async () => {
    const pdf = await createBlankPdf();
    const result = await embedResume(pdf, validResume as Resume);

    expect(await isVitaeFlowPdf(result)).toBe(true);
  });

  it('should throw on invalid pdf parameter', async () => {
    await expect(
      embedResume(null as unknown as Uint8Array, validResume as Resume),
    ).rejects.toThrow('Uint8Array');

    await expect(
      embedResume(new Uint8Array(0), validResume as Resume),
    ).rejects.toThrow('Uint8Array');
  });
});
