import { embed } from '@vitaeflow/pdf-embed';
import { validateResume } from '../validation/validate.js';
import {
  VITAEFLOW_FILENAME,
  VITAEFLOW_MIME_TYPE,
  VITAEFLOW_XMP_NAMESPACE,
  VITAEFLOW_XMP_PREFIX,
  SDK_GENERATOR_STRING,
} from '../constants.js';
import type { Resume } from '../types.js';

/**
 * Validate a resume and embed it in a PDF document.
 *
 * Validates in strict mode before embedding. If the resume is invalid,
 * an error is thrown with the validation details.
 *
 * If the PDF already contains a `vitaeflow.json`, it will be overwritten.
 *
 * @param pdf - The source PDF as a Uint8Array.
 * @param resume - The resume data to embed.
 * @returns The modified PDF as a Uint8Array.
 * @throws If the resume fails strict validation.
 */
export async function embedResume(
  pdf: Uint8Array,
  resume: Resume,
): Promise<Uint8Array> {
  if (!(pdf instanceof Uint8Array) || pdf.length === 0) {
    throw new Error('Expected a non-empty Uint8Array for the PDF parameter.');
  }

  const result = validateResume(resume, { mode: 'strict' });
  if (!result.valid) {
    const messages = result.errors.map((e) => `${e.path}: ${e.message}`);
    throw new Error(
      `Invalid resume:\n${messages.join('\n')}`,
    );
  }

  const json = JSON.stringify(resume, null, 2);

  return embed(pdf, json, {
    filename: VITAEFLOW_FILENAME,
    mimeType: VITAEFLOW_MIME_TYPE,
    relationship: 'Alternative',
    description: 'VitaeFlow structured resume data',
    xmp: {
      namespace: VITAEFLOW_XMP_NAMESPACE,
      prefix: VITAEFLOW_XMP_PREFIX,
      properties: {
        DocumentType: 'RESUME',
        Version: resume.version,
        ConformanceLevel: resume.profile,
        Generator: resume.meta?.generator ?? SDK_GENERATOR_STRING,
      },
    },
  });
}
