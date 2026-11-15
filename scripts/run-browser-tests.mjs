import { spawn } from 'node:child_process';

const [mode, ...args] = process.argv.slice(2);
if (mode === 'visual' && process.platform !== 'win32') {
  console.error('Visual baselines are maintained on Windows. Use the Windows visual job in extended-tests.yml.');
  process.exit(1);
}
const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...args], {
  stdio: 'inherit',
  env: { ...process.env, ...(mode === 'all' ? { PW_ALL_BROWSERS: '1' } : { PW_VISUAL: '1' }) },
});
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
