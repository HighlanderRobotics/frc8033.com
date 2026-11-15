import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { createPaths } from '../../src/lib/paths.mjs';

describe.each(['/', '/frc8033.com/', '/preview/nested/'])('deployment at %s', base => {
  const paths = createPaths(base);
  it('resolves the homepage and strips a directory URL', () => {
    expect(paths.withBase('/')).toBe(paths.root);
    expect(paths.withoutBase(paths.withBase('/robots/paddo/'))).toBe('/robots/paddo');
    expect(paths.withoutBase(paths.root.slice(0, -1) || '/')).toBe('/');
  });
  it('preserves query strings and fragments', () => {
    expect(paths.withBase('/faq?topic=fees#answer')).toBe(paths.root + 'faq?topic=fees#answer');
  });
  it.each(['https://example.com/', '//www.youtube.com/embed/video', 'mailto:team@example.com', 'tel:123', '#main', 'relative.png', 'data:image/png;base64,ABC', '', undefined])('preserves non-root URL %s', value => {
    expect(paths.withBase(value)).toBe(value);
  });
  it('prefixes each responsive image and retains its descriptor', () => {
    expect(paths.srcset('/assets/a.png 500w, /uploads/b.png 1000w')).toBe(`${paths.withBase('/assets/a.png')} 500w, ${paths.withBase('/uploads/b.png')} 1000w`);
    expect(paths.srcset('data:image/png;base64,ABC')).toBe('data:image/png;base64,ABC');
    expect(paths.srcset('')).toBe('');
    expect(paths.srcset(undefined)).toBeUndefined();
  });
});

it('normalizes repeated base slashes and distinguishes similar prefixes', () => {
  const paths = createPaths('//preview///nested//');
  expect(paths.root).toBe('/preview/nested/');
  expect(createPaths().root).toBe('/');
  const project = createPaths('/frc8033.com/');
  for (const suffix of ['', '/', '?q=robot', '#main']) {
    expect(project.withBase('/frc8033.com' + suffix)).toBe('/frc8033.com' + suffix);
  }
  expect(project.withBase('/frc8033.com-other/')).toBe('/frc8033.com/frc8033.com-other/');
  expect(project.withoutBase('/frc8033.com-other/')).toBe('/frc8033.com-other');
});

// These invariants cover many valid deployment prefixes and routes, rather than
// repeating the implementation to calculate expected output.
const segment = fc.stringMatching(/^[a-z][a-z0-9-]{0,15}$/);
it('round-trips arbitrary logical routes and never double-prefixes a URL', () => {
  fc.assert(fc.property(
    fc.array(segment, { maxLength: 3 }),
    fc.array(segment, { minLength: 1, maxLength: 4 }),
    (prefix, route) => {
      const paths = createPaths('/' + prefix.join('/') + '/');
      const logical = '/' + route.join('/');
      // A logical route already inside the deployment prefix is intentionally
      // treated as prefixed; exclude that ambiguous input from round-tripping.
      fc.pre(paths.root === '/' || !(logical === paths.root.slice(0, -1) || logical.startsWith(paths.root)));
      const deployed = paths.withBase(logical);
      expect(paths.withBase(deployed)).toBe(deployed);
      expect(paths.withoutBase(deployed)).toBe(logical);
      expect(paths.withoutBase(deployed + '/')).toBe(logical);
    },
  ), { numRuns: 300 });
});
