/** Schema version embedded in this SDK. */
export const SCHEMA_VERSION = '0.1';

/** Filename used for the embedded JSON in PDFs. */
export const VITAEFLOW_FILENAME = 'vitaeflow.json';

/** MIME type for the embedded file. */
export const VITAEFLOW_MIME_TYPE = 'application/json';

/** XMP namespace URI for VitaeFlow metadata. */
export const VITAEFLOW_XMP_NAMESPACE = 'urn:vitaeflow:pdfa:resume:1p0#';

/** XMP namespace prefix. */
export const VITAEFLOW_XMP_PREFIX = 'vf';

/** Default generator string used in XMP when meta.generator is not set. */
export const SDK_GENERATOR_STRING = `@vitaeflow/sdk/${SCHEMA_VERSION}`;
