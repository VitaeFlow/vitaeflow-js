export type Profile = 'minimal' | 'basic' | 'standard' | 'full';

export type ValidationMode = 'strict' | 'tolerant';

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

export interface Resume {
  version: string;
  profile: Profile;
  lang?: string;
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
  custom?: Record<string, unknown>;
}

export interface Basics {
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

export interface Location {
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface SocialProfile {
  network: string;
  url: string;
  username?: string;
}

export interface WorkEntry {
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

export interface EducationEntry {
  institution: string;
  startDate: string;
  url?: string;
  area?: string;
  studyType?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface SkillItem {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface LanguageEntry {
  language: string;
  fluency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native' | 'bilingual';
  code?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  date?: string;
  validUntil?: string;
  url?: string;
}

export interface ProjectEntry {
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
  keywords?: string[];
  roles?: string[];
}

export interface PublicationEntry {
  name: string;
  publisher?: string;
  date?: string;
  url?: string;
  summary?: string;
}

export interface VolunteerEntry {
  organization: string;
  position: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface ReferenceEntry {
  name: string;
  position?: string;
  organization?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface InterestEntry {
  name: string;
  keywords?: string[];
}
