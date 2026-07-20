export type Profile = 'standard';

export type ValidationMode = 'strict' | 'tolerant';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Extensions = Record<string, JsonValue>;

export interface Extensible {
  /** Domain-specific data keyed by a reverse-DNS namespace. */
  extensions?: Extensions;
}

export interface ValidationOptions {
  mode?: ValidationMode;
}

export interface ValidationError {
  /** JSON Pointer path to the invalid field (e.g. "/work/0/startDate"). */
  path: string;
  /** Human-readable error message. */
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  /** Warnings (e.g. schema version mismatch in tolerant mode). */
  warnings: string[];
}

export interface ExtractResult {
  /** The parsed resume, or null if the embedded JSON could not be parsed. */
  resume: Resume | null;
  validation: ValidationResult;
}

// --- Resume types ---

export interface Meta extends Extensible {
  generator?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resume extends Extensible {
  version: string;
  profile: Profile;
  lang?: string;
  meta?: Meta;
  basics: Basics;
  work?: WorkEntry[];
  education?: EducationEntry[];
  skills?: SkillCategory[];
  languages?: LanguageEntry[];
  certifications?: CertificationEntry[];
  projects?: ProjectEntry[];
  publications?: PublicationEntry[];
  volunteer?: VolunteerEntry[];
  references?: ReferenceEntry[];
  interests?: InterestEntry[];
}

export interface Basics extends Extensible {
  givenName: string;
  familyName: string;
  email: string;
  headline?: string;
  phone?: string;
  url?: string;
  image?: string;
  pronouns?: string;
  summary?: string;
  location?: Location;
  profiles?: SocialProfile[];
}

export interface Location extends Extensible {
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface SocialProfile extends Extensible {
  network: string;
  url: string;
  username?: string;
}

export interface WorkEntry extends Extensible {
  organization: string;
  position: string;
  startDate: string;
  type?: 'employment' | 'freelance' | 'contract' | 'internship';
  remote?: 'onsite' | 'remote' | 'hybrid';
  url?: string;
  location?: Location;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface EducationEntry extends Extensible {
  institution: string;
  startDate: string;
  url?: string;
  area?: string;
  studyType?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface SkillCategory extends Extensible {
  category: string;
  items: SkillItem[];
}

export interface SkillItem extends Extensible {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface LanguageEntry extends Extensible {
  language: string;
  fluency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native' | 'bilingual';
  code?: string;
}

export interface CertificationEntry extends Extensible {
  name: string;
  issuer: string;
  date?: string;
  validUntil?: string;
  url?: string;
}

export interface ProjectEntry extends Extensible {
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
  keywords?: string[];
  roles?: string[];
}

export interface PublicationEntry extends Extensible {
  name: string;
  publisher?: string;
  date?: string;
  url?: string;
  summary?: string;
}

export interface VolunteerEntry extends Extensible {
  organization: string;
  position: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface ReferenceEntry extends Extensible {
  name: string;
  position?: string;
  organization?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface InterestEntry extends Extensible {
  name: string;
  keywords?: string[];
}
