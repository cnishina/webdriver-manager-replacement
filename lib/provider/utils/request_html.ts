import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';
import {convertXml2js, readXml} from './file_utils';
import {isExpired} from './file_utils';
import {HttpOptions, JsonObject, requestBody} from './http_utils';
import {VersionList} from './version_list';
import { match } from 'minimatch';

/**
 * Make an http request and write it to the file.
 * @param htmlUrl The html android url.
 * @param httpOptions The http options for the request.
 */
export async function updateHtml(
    htmlUrl: string,
    httpOptions: HttpOptions): Promise<string> {
  if (isExpired(httpOptions.fileName)) {
    const contents = await requestBody(htmlUrl, httpOptions);
    const dir = path.dirname(httpOptions.fileName);
    try {
      fs.mkdirSync(dir);
    } catch (err) {
    }
    fs.writeFileSync(httpOptions.fileName, contents);
    return contents;
  } else {
    return fs.readFileSync(httpOptions.fileName).toString();
  }
}

/**
 * Returns a list of versions and the partial url paths.
 * @param fileName the location of the xml file to read.
 * @returns the version numbers.
 */
export function convertHtmlToVersionNumbers(
    fileName: string): string[]|null {
  const contents = fs.readFileSync(fileName);
  const regex = /(sdk-tools-\w+-\d+.zip)/g
  let regExpExecArray: RegExpExecArray;
  const versions: string[] = [];
  while(regExpExecArray = regex.exec(contents.toString()))
    versions.push(regExpExecArray[1]);
  return versions;
}