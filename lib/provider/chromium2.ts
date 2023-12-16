import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
import * as loglevel from 'loglevel';

import { requestBody, JsonObject, requestBinary } from './utils/http_utils';
import { changeFilePermissions, generateConfigFile, getBinaryPathFromConfig, removeFiles, unzipFile } from './utils/file_utils';
import { isExpired } from './utils/file_utils';
import { OUT_DIR, ProviderClass, ProviderConfig, ProviderInterface } from './provider';
import rimraf = require('rimraf');

const log = loglevel.getLogger('webdriver-manager');

interface VersionWithDownload {
  version?: string;
  revision?: string;
  downloads?: {chrome: Array<{platform: "string", url: "string"}>};
}

interface KnownGoodVersionWithDownloads {
  timestamp: string;
  versions: VersionWithDownload[];
}


export class Chromium extends ProviderClass implements ProviderInterface {
  // seleniumFlag?: string;
  // version?: string;
  // maxVersion?: string;
  cacheFileName = 'chromium-all.json';
  configFileName = 'chromium.config.json';
  ignoreSSL = false;
  osType = os.type();
  osArch = os.arch();
  outDir = OUT_DIR;
  proxy: string = null;
  maxVersion: string = null;
  
  constructor(config?: ProviderConfig) {
    super();
    this.cacheFileName = this.setVar('cacheFileName', this.cacheFileName, config);
    this.configFileName = this.setVar('configFileName', this.configFileName, config);
    this.ignoreSSL = this.setVar('ignoreSSL', this.ignoreSSL, config);
    this.osArch = this.setVar('osArch', this.osArch, config);
    this.osType = this.setVar('osType', this.osType, config);
    this.outDir = this.setVar('outDir', this.outDir, config);
    this.proxy = this.setVar('proxy', this.proxy, config);
    this.maxVersion = this.setVar('maxVersion', this.maxVersion, config);
  }

  private makeDirectory(fileName: string) {
    const dir = path.dirname(fileName);
    try {
      fs.mkdirSync(dir);
    } catch (err) {
    }
  }

  async updateBinary(_: string, majorVersion?: string): Promise<void> {
    // request to https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json
    const fileName = path.resolve(this.outDir, this.cacheFileName);
    this.makeDirectory(fileName);
    const httpOptions = { fileName, ignoreSSL: this.ignoreSSL,
      proxy: this.proxy };
    const contents = await requestBody('https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json', httpOptions);
    const knownVersions = JSON.parse(contents) as KnownGoodVersionWithDownloads;

    // get the highest matching major version
    let workingSemanticVersion = '0.0.0';
    let versionWithDownload: VersionWithDownload = {};
    for (const version of knownVersions.versions) {
      const fullVersion = version.version.split('.');
      if (majorVersion === fullVersion[0]) {
        const major = fullVersion[1];
        const minor = fullVersion[2];
        const patch = fullVersion[3];
        const semanticVersion = `${major}.${minor}.${patch}`;
        if (semver.gt(semanticVersion, workingSemanticVersion)) {
          workingSemanticVersion = semanticVersion;
          versionWithDownload = version;
        }
      }
    }

    if (!versionWithDownload.version) {
      // ruh roh we should do something here.
    }

    // get downloads
    const downloads = versionWithDownload.downloads;
    console.log(downloads);
    

    // get the os and matching arch type
    const platform = osHelper(this.osType, this.osArch);
    for (const download of downloads.chrome) {
      if (platform === download.platform) {
        console.log(download.url);
      }
    }

    // get download url
  }

  getBinaryPath(version?: string): string | null {
    return null;
  }

  getStatus(): string | null {
    return null;
  }

  cleanFiles(): string {
    return '';
  }
}

/**
 * Helps translate the os type and arch to the download name associated
 * with composing the download link.
 * @param ostype The operating stystem type.
 * @param osarch The chip architecture.
 * @returns The download name associated with composing the download link.
 */
export function osHelper(ostype: string, osarch: string): string {
  if (ostype === 'Darwin') {
    if (osarch === 'arm64') {
      return 'mac-arm64';
    } else if (osarch === 'x64') {
      return 'mac-x64';
    }
  } else if (ostype === 'Windows_NT') {
    if (osarch === 'x64') {
      return 'win64';
    } else if (osarch === 'x32') {
      return 'win32';
    }
  } else if (ostype === 'Linux') {
    if (osarch === 'x64') {
      return 'linux64';
    }
  }
  return null;
}
