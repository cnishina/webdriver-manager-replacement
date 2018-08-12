import * as yargs from 'yargs';
import * as clean from '../cmds/clean';
import * as start from '../cmds/start';
import * as status from '../cmds/status';
import * as update from '../cmds/update';

yargs.option('foo', {})

const chrome = {
  describe: 'Install or update chromedriver.',
  default: true,
  type: 'boolean'
};
const gecko = {
  describe: 'Install or update geckodriver.',
  default: true,
  type: 'boolean'
};
const ie = {
  describe: 'Install or update ie driver.',
  default: false,
  type: 'boolean'
};
const ignoreSSL = {
  describe: 'Ignore SSL certificates.',
  type: 'boolean'
}
const outDir = {
  describe: 'Location of output.',
  default: 'downloads',
  type: 'string'
};
const proxy = {
  describe: 'Use a proxy server to download files.',
  type: 'string'
};
const standalone = {
  describe: 'Install or update selenium server standalone.',
  default: true,
  type: 'boolean'
};
const versionsChrome = {
  describe: 'The chromedriver version.',
  type: 'string'
};
const versionsGecko = {
  describe: 'The geckodriver version.',
  type: 'string'
};
const versionsIe = {
  describe: 'The ie driver version.',
  type: 'string'
};
const versionsStandalone = {
  describe: 'The selenium server standalone version.',
  type: 'string'
};

yargs
  .command('clean', 'Removes downloaded files from the out_dir',
    (yargs) => {
      return yargs.option('out_dir', outDir)
    }, (argv: yargs.Arguments) => {
      clean.handler(argv);
    })
  .command('start', 'Start up the selenium server.',
    (yargs) => {
      return yargs.option('out_dir', outDir)
        .option('chrome', chrome)
        .option('gecko',  gecko)
        .option('ie', ie)
        .option('out_dir', outDir)
        .option('standalone', standalone)
        .option('versions_chrome', versionsChrome)
        .option('versions.gecko', versionsGecko)
        .option('versions.ie', versionsIe)
        .option('versions.standalone', versionsStandalone);
    }, (argv: yargs.Arguments) => {
      start.handler(argv);
    })
  .command('status', 'List the current available binaries.',
    (yargs) => {
      return yargs.option('out_dir', outDir)
    }, (argv: yargs.Arguments) => {
      status.handler(argv);
    })
  .command('update', 'Install or update selected binaries.',
    (yargs) => {
      return yargs.option('out_dir', outDir)
        .option('chrome', chrome)
        .option('gecko',  gecko)
        .option('ie', ie)
        .option('ignore_ssl', ignoreSSL)
        .option('out_dir', outDir)
        .option('proxy', proxy)
        .option('standalone', standalone)
        .option('versions_chrome', versionsChrome)
        .option('versions.gecko', versionsGecko)
        .option('versions.ie', versionsIe)
        .option('versions.standalone', versionsStandalone);
    }, (argv: yargs.Arguments) => {
      update.handler(argv);
    })
  .help()
  .argv;