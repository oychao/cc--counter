import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import program from 'commander';
import shell from 'shelljs';
import { version as VERSION } from '../package.json';

import countChar from './main';

const CCC_NAME = chalk.bold.blue(`cc-counter ${VERSION}`);

// error if no npm
if (!shell.which('npm') || !shell.which('node')) {
  shell.echo(`${chalk.red('Error:')} cc-counter requires npm and nodejs.`);
  shell.exit(1);
}

// build a cli program
program
  .name(chalk.green('ccc'))
  .usage(chalk.green('[project name] [options]'))
  .description(`${CCC_NAME}: calculate Chinese characters under a folder`)
  .version(VERSION, '-v, --version')
  .parse(process.argv);

// const filename = program.args.shift().replace(/\//g, '');

// const result = fs.readFileSync(filename, 'utf-8');

const scaler = {};

fs.readdir('./', (err, files) => {
  files.forEach(file => {
    if (!fs.lstatSync(file).isDirectory()) {
      const result = fs.readFileSync(file, 'utf-8');
      scaler[file] = countChar(result);
    }
  });

  const result = Object.keys(scaler).reduce(
    (acc, key) => {
      const { zh, punc } = scaler[key];
      const all = zh + punc;
      acc.zh += zh;
      acc.punc += punc;
      acc.all += all;
      process.stdout.write(
        `文件:${key} - 字数:${zh}, 标点:${punc}, 全部:${all}\n`
      );
      return acc;
    },
    { zh: 0, punc: 0, all: 0 }
  );
  const { zh, punc, all } = result;
  process.stdout.write(`总计 - 字数:${zh}, 标点:${punc}, 全部:${all}\n`);
});
