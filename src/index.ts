export { validateResume } from './validation/validate.js';
export { embedResume } from './pdf/embed.js';
export { extractResume, isVitaeFlowPdf } from './pdf/extract.js';
export { SCHEMA_VERSION } from './constants.js';

export type {
  Profile,
  ValidationMode,
  ValidationOptions,
  ValidationError,
  ValidationResult,
  ExtractResult,
  Resume,
  Basics,
  Location,
  SocialProfile,
  WorkEntry,
  EducationEntry,
  SkillCategory,
  SkillItem,
  LanguageEntry,
  CertificationEntry,
  ProjectEntry,
  PublicationEntry,
  VolunteerEntry,
  ReferenceEntry,
  InterestEntry,
} from './types.js';
