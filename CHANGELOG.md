# Changelog

All notable changes to `@vitaeflow/sdk` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2026-07-20

### Fixed

- Map `meta.createdAt` and `meta.updatedAt` to the embedded resume file metadata

## [0.4.0] - 2026-07-20

### Added

- Support schema v0.2 namespaced `extensions` on every structured resume object
- Export `JsonValue`, `Extensions`, and `Extensible` TypeScript types

### Changed

- Remove the root-only `custom` field from the `Resume` type and strict schema
