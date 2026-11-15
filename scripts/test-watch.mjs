import { spawn } from 'node:child_process';
import { watch } from 'chokidar';

const production = process.argv.includes('--production');
const children = new Set();
let stopping = false, running = false, pending = false, timer;
function start(args, env = {}) {
  const child = spawn(process.execPath, args, { stdio: 'inherit', env: { ...process.env, ...env }, detached: process.platform !== 'win32', windowsHide: true });
  children.add(child);
  child.on('exit', () => children.delete(child));
  child.on('error', error => console.error(error));
  return child;
}
function run(args, env) {
  return new Promise(resolve => {
    const child = start(args, env);
    child.once('error', () => resolve(1));
    child.once('exit', code => resolve(code ?? 1));
  });
}
async function browserChecks() {
  if (stopping) return;
  if (running) { pending = true; return; }
  running = true;
  pending = false;
  try {
    console.log(`\n[watch] Running ${production ? 'production build and browser suite' : 'browser smoke tests'}…`);
    let code = 0;
    if (production) code = await run([process.env.npm_execpath, 'run', 'check']);
    if (code === 0 && !stopping) code = await run([
      'node_modules/@playwright/test/cli.js', 'test',
      ...(production ? [] : ['--grep', 'navigation|menu|skip link|FAQ|overflow']),
    ], production ? {} : { PW_DEV: '1' });
    console.log(`[watch] ${code === 0 ? 'Passed' : 'Failed; watching for the next edit.'}`);
  } finally {
    running = false;
    if (pending && !stopping) void browserChecks();
  }
}
if (!production) start(['node_modules/vitest/vitest.mjs', '--watch']);
const watcher = watch([
  'src', 'public', 'config', 'tests', 'scripts', 'astro.config.mjs', 'playwright.config.ts',
  'vitest.config.ts', 'package.json', 'package-lock.json',
], { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 250, pollInterval: 100 } });
watcher.on('all', () => {
  clearTimeout(timer);
  timer = setTimeout(() => void browserChecks(), 600);
});
watcher.on('error', error => { console.error(error); shutdown(1); });
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  clearTimeout(timer);
  void watcher.close();
  if (process.platform === 'win32') {
    // Kill grandchildren too, including the Astro preview owned by Playwright.
    for (const child of children) spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  } else {
    for (const child of children) {
      try { process.kill(-child.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') console.error(error); }
    }
  }
  process.exitCode = code;
}
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
console.log('[watch] Saving a file reruns tests; edits during a run are queued. Ctrl+C stops watching.');
void browserChecks();
