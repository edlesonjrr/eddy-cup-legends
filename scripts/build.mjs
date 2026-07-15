import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { build } from 'vite';

await build();
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
cpSync('.openai/hosting.json', 'dist/.openai/hosting.json');
cpSync('worker/index.js','dist/server/index.js');
if(existsSync('drizzle')){mkdirSync('dist/.openai/drizzle',{recursive:true});cpSync('drizzle','dist/.openai/drizzle',{recursive:true})}
