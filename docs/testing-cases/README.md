# Accepted testing knowledge

Record durable lessons from reviewed test improvements here: intended user
behavior, the regression that exposed a gap, why an assertion is useful, and
limits on verification. Future AI runs read these notes and accepted tests.
This persists useful repository context; it does not retrain the model.

Current requirements:

- Directory URLs work at `/` and `/frc8033.com/`, retain query strings and
  fragments, and never receive a deployment prefix twice.
- Navigation works on mobile and with a keyboard, closes on Escape, and returns
  focus to the relevant control.
- Search uses the built Pagefind index and returns usable prefixed links.
- The robot model loads on demand, reports failures, retains zoom updates
  already consumed by OrbitControls, and avoids idle/offscreen drawing.
- Tests never submit external forms, write to Google Drive, or depend on
  third-party embed availability.
- Screenshot updates require design review and are excluded from AI proposals.
