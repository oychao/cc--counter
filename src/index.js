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

const blackList = ['.DS_Store'];

fs.readdir('./', (err, files) => {
  files.forEach(file => {
    if (!fs.lstatSync(file).isDirectory() && blackList.indexOf(file) === -1) {
      const result = fs.readFileSync(file, 'utf-8');
      scaler[file] = countChar(result);
    }
  });

  process.stdout.write(
    `#\t全部\t字数\t标点:\t文件名\n`
  );
  const result = Object.keys(scaler).reduce(
    (acc, key, idx) => {
      const { zh, punc } = scaler[key];
      const all = zh + punc;
      acc.zh += zh;
      acc.punc += punc;
      acc.all += all;
      process.stdout.write(
        `${idx + 1}\t${all}\t${zh}\t${punc}\t${key}\n`
      );
      return acc;
    },
    { zh: 0, punc: 0, all: 0 }
  );
  const { zh, punc, all } = result;
  process.stdout.write(`/\t${all}\t${zh}\t${punc}\t总计\n`);
});
