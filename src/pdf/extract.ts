import { extract, list } from '@vitaeflow/pdf-embed';
import { validateResume } from '../validation/validate.js';
import { VITAEFLOW_FILENAME } from '../constants.js';
import type {
  ExtractResult,
  Resume,
  ValidationOptions,
} from '../types.js';

/**
 * Extract and validate a VitaeFlow resume from a PDF document.
 *
 * Returns null if the PDF does not contain a `vitaeflow.json` embedded file.
 * Otherwise returns the parsed resume and its validation result.
 *
 * Defaults to tolerant mode so that resumes from newer schema versions
 * can still be partially read.
 *
 * @param pdf - The PDF as a Uint8Array.
 * @param options - Validation options. Defaults to tolerant mode.
 * @returns The extracted resume and validation result, or null.
 */
export async function extractResume(
  pdf: Uint8Array,
  options?: ValidationOptions,
): Promise<ExtractResult | null> {
  const mode = options?.mode ?? 'tolerant';

  if (!(pdf instanceof Uint8Array) || pdf.length === 0) {
    throw new Error('Expected a non-empty Uint8Array for the PDF parameter.');
  }

  const data = await extract(pdf, VITAEFLOW_FILENAME);
  if (!data) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(data));
  } catch {
    return {
      resume: null,
      validation: {
        valid: false,
        errors: [{ path: '', message: 'Embedded JSON is not valid JSON.' }],
        warnings: [],
      },
    };
  }

  const validation = validateResume(parsed, { mode });

  return {
    resume: validation.valid ? (parsed as Resume) : null,
    validation,
  };
}

/**
 * Check if a PDF contains an embedded VitaeFlow resume.
 *
 * This is a fast check that only inspects the embedded files list
 * without parsing or validating the JSON content.
 *
 * @param pdf - The PDF as a Uint8Array.
 * @returns True if the PDF contains a `vitaeflow.json` file.
 */
export async function isVitaeFlowPdf(pdf: Uint8Array): Promise<boolean> {
  if (!(pdf instanceof Uint8Array) || pdf.length === 0) {
    throw new Error('Expected a non-empty Uint8Array for the PDF parameter.');
  }

  const files = await list(pdf);
  return files.some((f) => f.filename === VITAEFLOW_FILENAME);
}
