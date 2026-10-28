#!/usr/bin/env node

/* global process, console, fetch */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const AUTH_PATH = path.join(os.homedir(), '.local/share/com.vercel.cli/auth.json');
const CONFIG_PATH = path.join(os.homedir(), '.local/share/com.vercel.cli/config.json');
const PROJECT_NAME = process.env.VERCEL_PROJECT ?? 'cscosmos';

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let amount = value;
  while (amount >= 1000 && index < units.length - 1) {
    amount /= 1000;
    index += 1;
  }
  const digits = index >= 3 ? 2 : 1;
  return `${amount.toFixed(digits)} ${units[index]}`;
}

function startOfPacificDay(now) {
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  const offset = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'longOffset',
  })
    .formatToParts(now)
    .find((part) => part.type === 'timeZoneName')
    .value.replace('GMT', '');

  return new Date(`${date}T00:00:00${offset}`);
}

async function request(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const message = payload?.error?.message ?? payload?.message ?? text;
    throw new Error(`${response.status} ${message}`);
  }

  return payload;
}

async function main() {
  const auth = readJson(AUTH_PATH);
  const config = readJson(CONFIG_PATH);
  const token = auth.token;
  const teamId = config.currentTeam;

  if (!token) throw new Error('Vercel CLI is not authenticated. Run `vercel login` first.');
  if (!teamId) throw new Error('No current Vercel team. Run `vercel switch` first.');

  const project = await request(
    `https://api.vercel.com/v9/projects/${encodeURIComponent(PROJECT_NAME)}?teamId=${encodeURIComponent(teamId)}`,
    token,
  );

  const summary = await request(
    `https://vercel.com/api/usage-summary?teamId=${encodeURIComponent(teamId)}`,
    token,
  );

  const now = new Date();
  const cycleStart = new Date(summary.cycle.start);
  const dayStart = startOfPacificDay(now);

  const deployments = await request(
    `https://api.vercel.com/v6/deployments?projectId=${encodeURIComponent(project.id)}&teamId=${encodeURIComponent(teamId)}&limit=100`,
    token,
  );

  async function query(metric, from, groupBy) {
    const payload = await request('https://vercel.com/api/v1/usage-metrics/query', token, {
      method: 'POST',
      body: JSON.stringify({
        teamId,
        metric,
        from: from.toISOString(),
        to: now.toISOString(),
        format: 'scalar',
        views: { summary: { groupBy } },
      }),
    });

    return payload.results?.views?.summary?.results ?? [];
  }

  async function storage(metric) {
    const [currentRows, peakRows] = await Promise.all([
      query(metric, dayStart, ['resourceId']),
      query(metric, cycleStart, ['resourceId']),
    ]);

    const find = (rows) => rows.find((row) => row.dimensionValues?.resourceId === project.id);
    return {
      current: find(currentRows)?.totalValue ?? 0,
      peak: find(peakRows)?.totalValue ?? 0,
    };
  }

  const [deploymentStorage, functionStorage] = await Promise.all([
    storage('deployment_storage_size'),
    storage('deployment_lambda_storage_size'),
  ]);

  const retained = Array.isArray(deployments.deployments) ? deployments.deployments.length : 0;

  console.log(`Project: ${project.name} (${project.id})`);
  console.log(`Retained deployments: ${retained}`);
  console.log(`Peak window: ${cycleStart.toISOString()} -> ${now.toISOString()}`);
  console.log(`Current billing day: ${dayStart.toISOString()} -> ${now.toISOString()}`);
  console.log('');
  console.log('Metric             Current      Peak');
  console.log('-----------------  -----------  -----------');
  console.log(
    `Deployment Storage ${formatBytes(deploymentStorage.current).padEnd(12)} ${formatBytes(deploymentStorage.peak)}`,
  );
  console.log(
    `Functions Storage  ${formatBytes(functionStorage.current).padEnd(12)} ${formatBytes(functionStorage.peak)}`,
  );
  console.log('');
  console.log('The Usage page shows the peak for the selected range, not the current value.');
  console.log('Choose a range that starts after the last cleanup to see the current value.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
