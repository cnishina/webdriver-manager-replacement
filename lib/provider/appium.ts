import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as semver from 'semver';
import { requestBody } from './utils/http_utils';

export class Appium {
  outDir: string;
  folder: string;
  npmApi: string = 'http://registry.npmjs.org/appium';

  /**
   * If no valid version is provided get version from appium
   */
  async getVersion(): Promise<string> {
    let body = await requestBody(this.npmApi);
    return JSON.parse(body)['dist-tags']['latest'];
  }

  /**
   * Creates appium directory and package.json file.
   * @param version Optional to provide the version number or latest.
   */
  async setup(version?: string): Promise<void> {
    if (!semver.valid(version)) {
      version = await this.getVersion();
    }
    this.folder = path.resolve(this.outDir, 'appium');
    try {
      rimraf.sync(this.folder);
    } catch (err) { }

    fs.mkdirSync(this.folder);
    let packageJson = {
      scripts: {appium: 'appium'},
      dependencies: {
        appium: '^' + version
      }
    };

    fs.writeFileSync(
      path.resolve(this.folder, 'package.json'), JSON.stringify(packageJson));
  }

  /**
   * Creates an appium/package.json file and installs the appium dependency.
   * @param version Optional to provide the version number or latest.
   */
  async updateBinary(version?: string): Promise<void> {
    console.log('appium: installing appium');
    await this.setup(version);
    childProcess.execSync('npm install', {cwd: this.folder});
  }
}