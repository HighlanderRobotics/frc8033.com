import assert from 'node:assert/strict';
import { createPaths } from '../src/lib/paths.mjs';
for (const base of ['/', '/frc8033.com/', '/preview/nested/']) {
  const { withBase, withoutBase, srcset, root } = createPaths(base);
  assert.equal(withBase('/'), root);
  assert.equal(withoutBase(withBase('/robots/paddo/')), '/robots/paddo');
  assert.equal(withBase(withBase('/assets/robot.png')), withBase('/assets/robot.png'));
  assert.equal(withBase('/faq?topic=fees#answer'), root + 'faq?topic=fees#answer');
  assert.equal(withBase('//www.youtube.com/embed/video'), '//www.youtube.com/embed/video');
  for (const url of ['https://example.com/', 'mailto:team@example.com', '#main', 'relative.png', 'data:image/png;base64,ABC']) assert.equal(withBase(url), url);
  assert.equal(srcset('/assets/a.png 500w, /uploads/b.png 1000w'), `${withBase('/assets/a.png')} 500w, ${withBase('/uploads/b.png')} 1000w`);
}
const project = createPaths('/frc8033.com/');
assert.equal(project.withBase('/frc8033.com-other/'), '/frc8033.com/frc8033.com-other/');
assert.equal(project.withoutBase('/frc8033.com-other/'), '/frc8033.com-other');
console.log('Path checks passed for root, project, and nested deployments.');
