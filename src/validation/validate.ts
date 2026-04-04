import type { ErrorObject } from 'ajv';
import { getSchemaValidator } from '../schema/compiler.js';
import { SCHEMA_VERSION } from '../constants.js';
import type {
  ValidationError,
  ValidationOptions,
  ValidationResult,
} from '../types.js';

/**
 * Validate a resume object against the VitaeFlow schema.
 *
 * @param data - The resume data to validate (unknown type for safety).
 * @param options - Validation options. Defaults to strict mode.
 * @returns Validation result with errors and warnings.
 */
export function validateResume(
  data: unknown,
  options?: ValidationOptions,
): ValidationResult {
  const mode = options?.mode ?? 'strict';
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Basic type check
  if (data === null || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ path: '', message: 'Resume must be an object.' }],
      warnings,
    };
  }

  const obj = data as Record<string, unknown>;

  // Version warning in tolerant mode
  if (mode === 'tolerant' && typeof obj.version === 'string') {
    if (compareVersions(obj.version, SCHEMA_VERSION) > 0) {
      warnings.push(
        `Resume uses schema version ${obj.version}, but this SDK supports ${SCHEMA_VERSION}. Some fields may not be validated.`,
      );
    }
  }

  // Validate against schema
  const schemaValidator = getSchemaValidator(mode);
  const schemaValid = schemaValidator(data);

  if (!schemaValid && schemaValidator.errors) {
    errors.push(...formatAjvErrors(schemaValidator.errors));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function formatAjvErrors(ajvErrors: ErrorObject[]): ValidationError[] {
  return ajvErrors.map((err) => ({
    path: err.instancePath,
    message: formatErrorMessage(err),
  }));
}

function formatErrorMessage(err: ErrorObject): string {
  if (err.keyword === 'required') {
    return `Missing required property: ${err.params.missingProperty}`;
  }
  if (err.keyword === 'additionalProperties') {
    return `Unknown property: ${err.params.additionalProperty}`;
  }
  if (err.keyword === 'enum') {
    return `Must be one of: ${err.params.allowedValues.join(', ')}`;
  }
  if (err.keyword === 'const') {
    return `Must be: ${err.params.allowedValue}`;
  }
  if (err.keyword === 'pattern') {
    return `Does not match expected format`;
  }
  if (err.keyword === 'type') {
    return `Expected type: ${err.params.type}`;
  }
  if (err.keyword === 'format') {
    return `Invalid format: expected ${err.params.format}`;
  }
  return err.message ?? 'Validation error';
}

/**
 * Compare two version strings (major.minor).
 * Returns positive if a > b, negative if a < b, 0 if equal.
 */
function compareVersions(a: string, b: string): number {
  const [aMajor = 0, aMinor = 0] = a.split('.').map(Number);
  const [bMajor = 0, bMinor = 0] = b.split('.').map(Number);
  if (isNaN(aMajor) || isNaN(aMinor) || isNaN(bMajor) || isNaN(bMinor)) return 0;
  if (aMajor !== bMajor) return aMajor - bMajor;
  return aMinor - bMinor;
}
