#!/usr/bin/env node

/* global process, console */

import { execFileSync } from 'node:child_process';

const project = process.env.VERCEL_PROJECT ?? 'cscosmos';
const keep = Number(process.argv[2] ?? process.env.VERCEL_KEEP ?? 3);
const scope = process.env.VERCEL_SCOPE ?? 'subhajit-pradhans-projects';
const token = process.env.VERCEL_TOKEN;

if (!Number.isInteger(keep) || keep < 1) {
  console.error('Usage: node scripts/prune-vercel-deployments.mjs [keep-count]');
  process.exit(1);
}

const lsArgs = ['ls', project, '--json', '--limit', '100'];
if (scope) lsArgs.push('--scope', scope);
if (token) lsArgs.push('--token', token);

const raw = execFileSync('vercel', lsArgs, { encoding: 'utf8' });
const payload = JSON.parse(raw);
const deployments = payload.deployments ?? [];
const remove = deployments.slice(keep).map((deployment) => deployment.url);

if (remove.length === 0) {
  console.log(`Nothing to prune; ${deployments.length} deployment(s) found (keep threshold: ${keep}).`);
  process.exit(0);
}

console.log(
  `Keeping the newest ${keep}; pruning ${remove.length} older deployment(s).`,
);

let removed = 0;
let skipped = 0;

for (const url of remove) {
  try {
    const rmArgs = ['remove', url, '--safe', '--yes'];
    if (scope) rmArgs.push('--scope', scope);
    if (token) rmArgs.push('--token', token);
    execFileSync('vercel', rmArgs, {
      stdio: 'ignore',
    });
    removed += 1;
  } catch {
    // --safe refuses to delete deployments with active aliases.
    skipped += 1;
  }
}

console.log(`Removed ${removed}; skipped ${skipped} with active aliases.`);
