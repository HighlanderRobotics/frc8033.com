# Testing instructions

Read docs/testing.md and docs/testing-cases/README.md before changing tests.
Use Vitest for pure logic, fast-check for useful invariants, and Playwright with
tests/e2e/fixtures.ts for browser behavior. Test observable requirements rather
than duplicating the implementation. For a bug fix, demonstrate that the
regression test fails before the fix and passes afterward when practical.

Do not disable tests, weaken assertions, update screenshots, or change production
behavior just to get a green result. Explain a genuine requirement change.
Never submit external forms or write to Google Drive or other external services
from tests. Keep unit tests fast. Browser search tests require the production
build. AI-generated additions belong in the generated subdirectories and must
be reviewed before merging. Record useful accepted lessons in testing-cases.

Run npm run test:unit for unit changes, npm run test:ci for browser/application
changes, and the relevant extended check for screenshot or mutation changes.
