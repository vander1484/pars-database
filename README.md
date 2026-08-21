# Pars Database

A modern, searchable historical database for Dunfermline Athletic.

## Project goals

- Preserve and migrate the historical records currently published at parsdatabase.co.uk.
- Model players, seasons, matches, competitions, league tables, appearances, goals, attendances and honours as relational data.
- Provide a fast, responsive web interface with global search and rich player, match, season and competition pages.
- Retain source provenance and uncertainty notes for historical records.

## Planned stack

- Next.js + TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- Node-based migration/import tooling

## Migration approach

The legacy site is treated as a read-only source. Data is first collected into staging records, validated and normalised, then loaded into the production schema. Source URLs and notes are retained so migrated records can be audited.

## Core entities

- Player
- Club
- Season
- Competition
- CompetitionSeason
- Match
- Appearance
- Goal
- LeagueTableEntry
- Honour
- SourceRecord

## Status

Initial project scaffold and migration design in progress.

Deployment refresh triggered for the latest UI QA fixes.
