# @vitaeflow/sdk

JavaScript SDK for the [VitaeFlow](https://vitaeflow.org) open standard — validate, embed, and extract structured resumes in PDF files.

## Install

```bash
npm install @vitaeflow/sdk
```

## Usage

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

Modes:
- **strict** — rejects unknown fields
- **tolerant** — ignores unknown fields, warns about version mismatch (forward-compatible)

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
  education: [{ institution: 'INSA Lyon', startDate: '2011-09' }],
  skills: [{ category: 'Languages', items: [{ name: 'TypeScript', level: 'expert' }] }],
  languages: [{ language: 'French', fluency: 'native' }],
};

const result = await embedResume(pdf, resume);
writeFileSync('cv.vf.pdf', result);
```

The resume is validated in strict mode before embedding. If invalid, an error is thrown. Using the `.vf.pdf` suffix is recommended for discoverability, but not required.

### Extract a resume from a PDF

```ts
import { extractResume } from '@vitaeflow/sdk';

const pdf = new Uint8Array(readFileSync('cv.vf.pdf'));
const result = await extractResume(pdf);

if (result) {
  console.log(result.resume);       // Resume object (or null if invalid)
  console.log(result.validation);   // { valid, errors, warnings }
}
```

### Check if a PDF contains VitaeFlow data

```ts
import { isVitaeFlowPdf } from '@vitaeflow/sdk';

const has = await isVitaeFlowPdf(pdf);
// true or false
```

## API

### Validation

| Function | Description |
|----------|-------------|
| `validateResume(data, options?)` | Validate a resume against the VitaeFlow schema |

### PDF operations

| Function | Description |
|----------|-------------|
| `embedResume(pdf, resume)` | Validate and embed a resume in a PDF |
| `extractResume(pdf, options?)` | Extract and validate a resume from a PDF |
| `isVitaeFlowPdf(pdf)` | Check if a PDF contains VitaeFlow data |

### Constants

| Constant | Value |
|----------|-------|
| `SCHEMA_VERSION` | `'0.1'` |

## Types

All TypeScript types are exported: `Resume`, `Meta`, `Basics`, `Location`, `SocialProfile`, `WorkEntry`, `EducationEntry`, `SkillCategory`, `SkillItem`, `LanguageEntry`, `CertificationEntry`, `ProjectEntry`, `PublicationEntry`, `VolunteerEntry`, `ReferenceEntry`, `InterestEntry`, `Profile`, `ValidationResult`, `ValidationError`, `ExtractResult`.

## What is VitaeFlow?

VitaeFlow is an open standard for embedding structured JSON resume data in PDF files. A VitaeFlow PDF is a normal PDF readable by anyone, but it also contains machine-readable data for ATS, job boards, and HR tools. The `.vf.pdf` suffix is recommended, not required.

- [Specification](https://github.com/VitaeFlow/vitaeflow-spec)
- [CLI](https://github.com/VitaeFlow/vitaeflow-cli)

## License

[MIT](LICENSE)
