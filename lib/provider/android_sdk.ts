import * as path from 'path';
import {unzipFile} from './utils/file_utils';
import {convertHtmlToVersionNumbers, updateHtml} from './utils/request_html';
import {requestBinary} from './utils/http_utils';

export class AndroidSdk {
  osType: string;
  osArch: string;
  outDir: string = '';
  
  async downloadTools() {
    const osVal = osHelper(this.osType, this.osArch);
    let fileName = path.resolve('android_studio.html');
    await updateHtml(
      'https://developer.android.com/studio/',
      {fileName});
    let version = convertHtmlToVersionNumbers(fileName)[0];
    fileName = path.resolve('sdk_tools.zip');
    await requestBinary(
      `https://dl.google.com/android/android-sdk_r${version}-${osVal}.zip`, 
      {fileName});
    unzipFile(fileName, this.outDir);
  }
}

/**
 * OS Helper when downloading the android-sdk.
 * @param osType
 * @param osArch 
 */
function osHelper(osType: string, osArch: string): string|null {
  if (osType === 'Windows_NT') {
    return 'windows';
  } else if (osType === 'Darwin') {
    return 'macosx';
  } else if (osType === 'Linux') {
    return 'linux';
  } else {
    return null;
  }
}