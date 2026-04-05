# @vitaeflow/sdk

[![npm version](https://img.shields.io/npm/v/@vitaeflow/sdk.svg)](https://www.npmjs.com/package/@vitaeflow/sdk)
[![license](https://img.shields.io/npm/l/@vitaeflow/sdk.svg)](LICENSE)

JavaScript/TypeScript SDK for the [VitaeFlow](https://vitaeflow.org) open standard — validate, embed, and extract structured resumes in PDF files.

Works in Node.js and the browser.

## Install

```bash
npm install @vitaeflow/sdk
```

## Quick start

### Validate a resume

```ts
import { validateResume } from '@vitaeflow/sdk';

const result = validateResume(resume, { mode: 'strict' });

if (result.valid) {
  console.log('Resume is valid!');
} else {
  for (const err of result.errors) {
    console.log(`${err.path}: ${err.message}`);
  }
}
```

Two validation modes:
- **strict** — rejects unknown fields (recommended for writing)
- **tolerant** — ignores unknown fields, warns about version mismatch (forward-compatible, recommended for reading)

### Embed a resume in a PDF

```ts
import { embedResume } from '@vitaeflow/sdk';
import { readFileSync, writeFileSync } from 'fs';

const pdf = new Uint8Array(readFileSync('cv.pdf'));
const resume = {
  version: '0.1',
  profile: 'standard',
  basics: { givenName: 'Marie', familyName: 'Laurent', email: 'marie@example.com' },
  work: [{ organization: 'TechCorp', position: 'Lead Dev', startDate: '2021-03' }],
};

const result = await embedResume(pdf, resume);
writeFileSync('cv.vf.pdf', result);
```

The resume is validated in strict mode before embedding. If invalid, an error is thrown.

### Extract a resume from a PDF

```ts
import { extractResume } from '@vitaeflow/sdk';
import { readFileSync } from 'fs';

const pdf = new Uint8Array(readFileSync('cv.vf.pdf'));
const result = await extractResume(pdf);

if (result?.resume) {
  console.log(result.resume.basics.givenName); // "Marie"
  console.log(result.validation.valid);        // true
}
```

### Check if a PDF contains VitaeFlow data

```ts
import { isVitaeFlowPdf } from '@vitaeflow/sdk';

const has = await isVitaeFlowPdf(pdf); // true or false
```

## API

| Function | Description |
|----------|-------------|
| `validateResume(data, options?)` | Validate a resume against the VitaeFlow schema |
| `embedResume(pdf, resume)` | Validate and embed a resume in a PDF |
| `extractResume(pdf, options?)` | Extract and validate a resume from a PDF |
| `isVitaeFlowPdf(pdf)` | Check if a PDF contains VitaeFlow data |
| `SCHEMA_VERSION` | Current schema version (`'0.1'`) |

## Types

All TypeScript types are exported:

`Resume` `Meta` `Basics` `Location` `SocialProfile` `WorkEntry` `EducationEntry` `SkillCategory` `SkillItem` `LanguageEntry` `CertificationEntry` `ProjectEntry` `PublicationEntry` `VolunteerEntry` `ReferenceEntry` `InterestEntry` `ValidationResult` `ValidationError` `ExtractResult`

## Ecosystem

| Project | Description |
|---------|-------------|
| [VitaeFlow Spec](https://github.com/VitaeFlow/vitaeflow-spec) | JSON schema and PDF embedding standard |
| [vitaeflow CLI](https://github.com/VitaeFlow/vitaeflow-cli) | Command-line tool |
| [vitaeflow.org](https://vitaeflow.org) | Website with interactive tools |

## License

[MIT](LICENSE)
