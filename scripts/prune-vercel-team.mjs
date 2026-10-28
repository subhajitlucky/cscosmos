#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const DEFAULT_KEEP = Number(process.env.VERCEL_KEEP ?? 5);
const CSCOSMOS_KEEP = Number(process.env.VERCEL_CSCOSMOS_KEEP ?? 10);

function run(args, options = {}) {
  return execFileSync('vercel', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    ...options,
  });
}

const projectPayload = JSON.parse(run(['project', 'ls', '--json', '--limit', '100']));
const projects = projectPayload.projects ?? [];

let totalRemoved = 0;
let totalSkipped = 0;

for (const project of projects) {
  const name = project.name;
  if (!name) continue;

  let deployments;
  try {
    const payload = JSON.parse(run(['ls', name, '--json', '--limit', '100']));
    deployments = payload.deployments ?? [];
  } catch {
    console.log(`${name}: skipped (could not list deployments)`);
    continue;
  }

  const keep = name === 'cscosmos' ? CSCOSMOS_KEEP : DEFAULT_KEEP;
  const remove = deployments.slice(keep).map((deployment) => deployment.url);

  if (remove.length === 0) {
    console.log(`${name}: ${deployments.length} deployment(s), nothing to prune`);
    continue;
  }

  try {
    run(['remove', ...remove, '--safe', '--yes']);
    totalRemoved += remove.length;
    console.log(`${name}: removed ${remove.length}, kept ${keep}`);
  } catch {
    let removed = 0;
    let skipped = 0;
    for (const url of remove) {
      try {
        run(['remove', url, '--safe', '--yes']);
        removed += 1;
      } catch {
        skipped += 1;
      }
    }
    totalRemoved += removed;
    totalSkipped += skipped;
    console.log(`${name}: removed ${removed}, skipped ${skipped} active alias(es)`);
  }
}

console.log(`Done. Removed ${totalRemoved}; skipped ${totalSkipped}.`);
