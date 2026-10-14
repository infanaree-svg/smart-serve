# Project Guidance

## User Preferences

- Follow the provided design closely: structure, colors, and Thai-language copy
- Fully functional, not a static mockup
- Thai language throughout the interface
- Deep green primary color with orange, blue, and red status accents; light gray background with white rounded cards

## Verified Commands

- **typecheck**: `mops check --fix`
- **build**: `mops build`

## Learnings

- Backend money is satang bigint and timestamps are nanosecond bigints; convert with timestampToDate and formatBaht before rendering.
- Mixin files under src/backend/mixins/ import sibling type modules with a parent-relative path ("../types/<domain>").
- 'label' is a Motoko reserved keyword; use timeLabel for record fields.
- A long Markdown body returned from a Motoko function must be a single double-quoted string with escaped quotes and no raw newlines.
- OQL Expose entities are declared in main.mo with .sample(...) on every chain; variant fields need a <Type>Value.mo module exporting _toRow, and Bool fields need BoolValue imported.
- With [canisters.backend.migrations] check-limit=1, at most one migration file may be pending; fold an init migration into the feature migration when the deployed baseline is an empty actor.
- react-router-dom v7 is not preinstalled in this template; install it with pnpm add react-router-dom when a task requires react-router.
- Tailwind v3 has no size-4.5 utility; use size-4/size-5 or an arbitrary value.
- Status color scales (warning/info/success/destructive/violet plus -soft tints) are mapped in tailwind.config.js, so bg-warning-soft/text-warning resolve directly.
- The root test script runs a frontend vitest lane plus a PocketIC backend lane at test/pocketic/run-backend-lane.mjs; run pnpm fix before pnpm check so biome formatting does not fail the build.
