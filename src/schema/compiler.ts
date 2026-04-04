import Ajv2020, { type AnySchema, type ValidateFunction } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

import schema from './schema.json' with { type: 'json' };

/**
 * Recursively remove all `additionalProperties: false` from a schema.
 * Used for tolerant mode so unknown fields are ignored.
 */
function stripAdditionalProperties(obj: AnySchema): AnySchema {
  if (Array.isArray(obj)) {
    return obj.map(stripAdditionalProperties) as AnySchema;
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'additionalProperties' && value === false) continue;
      result[key] = stripAdditionalProperties(value as AnySchema);
    }
    return result as AnySchema;
  }
  return obj;
}

function createAjv(): Ajv2020 {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv;
}

// One Ajv instance per mode.
let strictAjv: Ajv2020 | undefined;
let tolerantAjv: Ajv2020 | undefined;

function getAjv(mode: 'strict' | 'tolerant'): Ajv2020 {
  if (mode === 'strict') {
    if (!strictAjv) {
      strictAjv = createAjv();
      strictAjv.addSchema(schema as AnySchema, schema.$id);
    }
    return strictAjv;
  }

  if (!tolerantAjv) {
    tolerantAjv = createAjv();
    tolerantAjv.addSchema(
      stripAdditionalProperties(schema as AnySchema),
      schema.$id,
    );
  }
  return tolerantAjv;
}

let strictValidator: ValidateFunction | undefined;
let tolerantValidator: ValidateFunction | undefined;

/** Get the compiled schema validator for the given mode. */
export function getSchemaValidator(mode: 'strict' | 'tolerant'): ValidateFunction {
  if (mode === 'strict') {
    if (!strictValidator) {
      const ajv = getAjv('strict');
      strictValidator = ajv.getSchema(schema.$id) as ValidateFunction;
    }
    return strictValidator;
  }

  if (!tolerantValidator) {
    const ajv = getAjv('tolerant');
    tolerantValidator = ajv.getSchema(schema.$id) as ValidateFunction;
  }
  return tolerantValidator;
}
