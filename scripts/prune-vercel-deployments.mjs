#!/usr/bin/env node

/* global process, console */

import { execFileSync } from 'node:child_process';

const project = process.env.VERCEL_PROJECT ?? 'cscosmos';
const keep = Number(process.argv[2] ?? 10);

if (!Number.isInteger(keep) || keep < 1) {
  console.error('Usage: node scripts/prune-vercel-deployments.mjs [keep-count]');
  process.exit(1);
}

const raw = execFileSync(
  'vercel',
  ['ls', project, '--json', '--limit', '100'],
  { encoding: 'utf8' },
);

const payload = JSON.parse(raw);
const deployments = payload.deployments ?? [];
const remove = deployments.slice(keep).map((deployment) => deployment.url);

if (remove.length === 0) {
  console.log(`Nothing to prune; ${deployments.length} deployment(s) found.`);
  process.exit(0);
}

console.log(
  `Keeping the newest ${keep}; pruning ${remove.length} older deployment(s).`,
);

let removed = 0;
let skipped = 0;

for (const url of remove) {
  try {
    execFileSync('vercel', ['remove', url, '--safe', '--yes'], {
      stdio: 'ignore',
    });
    removed += 1;
  } catch {
    // --safe refuses to delete deployments with active aliases.
    skipped += 1;
  }
}

console.log(`Removed ${removed}; skipped ${skipped} with active aliases.`);
