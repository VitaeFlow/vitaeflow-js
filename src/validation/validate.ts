import type { ErrorObject } from 'ajv';
import { getSchemaValidator, getProfileValidator } from '../schema/compiler.js';
import { SCHEMA_VERSION } from '../constants.js';
import type {
  Profile,
  ValidationError,
  ValidationOptions,
  ValidationResult,
} from '../types.js';

const VALID_PROFILES = new Set<string>(['minimal', 'basic', 'standard', 'full']);

/**
 * Validate a resume object against the VitaeFlow schema and its declared profile.
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

  // Validate against main schema
  const schemaValidator = getSchemaValidator(mode);
  const schemaValid = schemaValidator(data);

  if (!schemaValid && schemaValidator.errors) {
    errors.push(...formatAjvErrors(schemaValidator.errors));
  }

  // Validate against profile if present and valid
  const profile = obj.profile;
  if (typeof profile === 'string' && VALID_PROFILES.has(profile)) {
    const profileValidator = getProfileValidator(profile as Profile, mode);
    const profileValid = profileValidator(data);

    if (!profileValid && profileValidator.errors) {
      const profileErrors = formatAjvErrors(profileValidator.errors);
      // Avoid duplicate errors — only add profile-specific ones
      const existingPaths = new Set(errors.map((e) => `${e.path}:${e.message}`));
      for (const err of profileErrors) {
        if (!existingPaths.has(`${err.path}:${err.message}`)) {
          errors.push(err);
        }
      }
    }
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
