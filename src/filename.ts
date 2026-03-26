import { VITAEFLOW_FILE_EXTENSION } from './constants.js';

/**
 * Check if a filename follows the VitaeFlow naming convention (`.vf.pdf`).
 *
 * @param filename - The filename to check.
 * @returns True if the filename ends with `.vf.pdf` (case-insensitive).
 */
export function isVitaeFlowFilename(filename: string): boolean {
  return filename.toLowerCase().endsWith(VITAEFLOW_FILE_EXTENSION);
}

/**
 * Apply the VitaeFlow naming convention to a filename.
 *
 * - If the name already ends with `.vf.pdf`, it is returned as-is.
 * - If it ends with `.pdf`, the `.pdf` is replaced by `.vf.pdf`.
 * - Otherwise `.vf.pdf` is appended.
 *
 * @param filename - The original filename.
 * @returns The filename with the `.vf.pdf` extension.
 */
export function formatVitaeFlowFilename(filename: string): string {
  if (isVitaeFlowFilename(filename)) return filename;

  if (filename.toLowerCase().endsWith('.pdf')) {
    return filename.slice(0, -4) + VITAEFLOW_FILE_EXTENSION;
  }

  return filename + VITAEFLOW_FILE_EXTENSION;
}
