#!/usr/bin/env node

const { spawn } = require('child_process');
const process = require('process');

const args = process.argv.slice(2);
const filesIndex = args.indexOf('--files');

let tscArgs = ['--noEmit'];

if (filesIndex !== -1 && filesIndex < args.length - 1) {
  // Get all arguments after --files
  const files = args.slice(filesIndex + 1);
  tscArgs = [...tscArgs, ...files];
}

const tsc = spawn('tsc', tscArgs, {
  stdio: 'inherit',
  shell: true
});

tsc.on('exit', (code) => {
  process.exit(code);
});
