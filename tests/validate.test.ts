import { describe, it, expect } from 'vitest';
import { validateResume } from '../src/index.js';
import validResume from './fixtures/valid-resume.json';

describe('validateResume', () => {
  describe('strict mode', () => {
    it('should accept a valid resume', () => {
      const result = validateResume(validResume, { mode: 'strict' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object input', () => {
      const result = validateResume('not an object', { mode: 'strict' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('object');
    });

    it('should reject null input', () => {
      const result = validateResume(null, { mode: 'strict' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('object');
    });

    it('should reject undefined input', () => {
      const result = validateResume(undefined, { mode: 'strict' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('object');
    });

    it('should reject missing required fields', () => {
      const result = validateResume({ version: '0.2' }, { mode: 'strict' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('profile'))).toBe(true);
    });

    it('should reject unknown fields', () => {
      const result = validateResume(
        { ...validResume, unknownField: 'test' },
        { mode: 'strict' },
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('unknownField'))).toBe(true);
    });

    it('should reject invalid email format', () => {
      const resume = {
        ...validResume,
        basics: { ...validResume.basics, email: 'not-an-email' },
      };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('email'))).toBe(true);
    });

    it('should reject invalid date format', () => {
      const resume = {
        ...validResume,
        work: [{ ...validResume.work[0], startDate: '2021-13-45' }],
      };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(false);
    });

    it('should reject invalid profile value', () => {
      const resume = { ...validResume, profile: 'mega' };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(false);
    });

    it('should accept a resume with meta', () => {
      const resume = {
        ...validResume,
        meta: {
          generator: 'VitaeFlow Builder/1.0',
          createdAt: '2026-03-27',
          updatedAt: '2026-03-27',
        },
      };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(true);
    });

    it('should accept a resume with partial meta', () => {
      const resume = {
        ...validResume,
        meta: { generator: 'MyApp/1.0' },
      };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(true);
    });

    it('should reject meta with unknown fields', () => {
      const resume = {
        ...validResume,
        meta: { generator: 'MyApp/1.0', unknownField: 'x' },
      };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(false);
    });

    it('should reject invalid skill level', () => {
      const resume = {
        ...validResume,
        skills: [{ category: 'Test', items: [{ name: 'X', level: 'godlike' }] }],
      };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(false);
    });

    it('should accept a minimal resume with only basics', () => {
      const resume = {
        version: '0.2',
        profile: 'standard',
        basics: { givenName: 'A', familyName: 'B', email: 'a@b.com' },
      };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(true);
    });

    it('should accept namespaced extensions on nested objects', () => {
      const resume = {
        ...validResume,
        basics: {
          ...validResume.basics,
          extensions: {
            'com.example.identity': { employeeId: 'EMP-42' },
          },
        },
        work: [{
          ...validResume.work[0],
          extensions: {
            'com.linkedin': {
              positionId: 'abc123',
              featured: true,
              labels: ['public', null],
            },
          },
        }],
      };

      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(true);
    });

    it('should reject extension keys that are not reverse-DNS namespaced', () => {
      const resume = {
        ...validResume,
        extensions: { linkedin: { id: 'abc123' } },
      };

      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(false);
    });

    it('should reject non-JSON extension values', () => {
      const resume = {
        ...validResume,
        extensions: { 'com.example': { transform: undefined } },
      };

      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(false);
    });

    it('should reject the removed custom field', () => {
      const resume = { ...validResume, custom: { foo: 'bar' } };
      const result = validateResume(resume, { mode: 'strict' });
      expect(result.valid).toBe(false);
    });
  });

  describe('tolerant mode', () => {
    it('should accept a valid resume', () => {
      const result = validateResume(validResume, { mode: 'tolerant' });
      expect(result.valid).toBe(true);
    });

    it('should accept unknown fields', () => {
      const result = validateResume(
        { ...validResume, futureField: 'from v2.0' },
        { mode: 'tolerant' },
      );
      expect(result.valid).toBe(true);
    });

    it('should warn about newer schema version', () => {
      const resume = { ...validResume, version: '99.0' };
      const result = validateResume(resume, { mode: 'tolerant' });
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('99.0');
    });

    it('should not warn for equal schema version', () => {
      const result = validateResume(validResume, { mode: 'tolerant' });
      expect(result.warnings).toHaveLength(0);
    });

    it('should not warn for malformed version strings', () => {
      const resume = { ...validResume, version: 'not-a-version' };
      const result = validateResume(resume, { mode: 'tolerant' });
      // Should not crash, and should not produce a misleading warning
      expect(result.warnings).toHaveLength(0);
    });

    it('should still reject structural errors', () => {
      const result = validateResume(
        { version: '0.2', profile: 'standard' },
        { mode: 'tolerant' },
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('basics'))).toBe(true);
    });
  });

  it('should default to strict mode', () => {
    const result = validateResume({ ...validResume, unknownField: 'x' });
    expect(result.valid).toBe(false);
  });
});
