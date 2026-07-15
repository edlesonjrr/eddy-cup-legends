import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';

execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite', 'build'], { stdio: 'inherit' });
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
cpSync('.openai/hosting.json', 'dist/.openai/hosting.json');
writeFileSync('dist/server/index.js', `export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n`);
