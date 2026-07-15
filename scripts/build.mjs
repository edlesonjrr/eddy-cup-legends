import { cpSync, copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { build } from 'vite';

await build();
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
cpSync('.openai/hosting.json', 'dist/.openai/hosting.json');
cpSync('worker/index.js','dist/server/index.js');
if(existsSync('drizzle')){mkdirSync('dist/.openai/drizzle',{recursive:true});for(const file of readdirSync('drizzle'))copyFileSync(`drizzle/${file}`,`dist/.openai/drizzle/${file}`)}
