import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as log from 'loglevel';
import * as os from 'os';
import * as path from 'path';

import {httpBaseUrl} from '../../../spec/server/env';
import {spawnProcess} from '../../../spec/support/helpers/test_utils';
import {convertHtmlToVersionNumbers, updateHtml} from './request_html';
import {HttpOptions } from './http_utils';

log.setLevel('debug');

describe('rqeuest_html', () => {
  const tmpDir = path.resolve(os.tmpdir(), 'test');
  let proc: childProcess.ChildProcess;
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
    proc = spawnProcess('node', ['dist/spec/server/http_server.js']);
    log.debug('http-server: ' + proc.pid);
    setTimeout(done, 3000);
  });

  afterAll((done) => {
    process.kill(proc.pid);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
    setTimeout(done, 5000);
  });

  describe('updateHtml', () => {
    it('should download the html file', async () => {
      const fileName = path.resolve(tmpDir, 'foo.html');
      const htmlUrl = httpBaseUrl + '/spec/support/files/android.html';
      let httpOptions: HttpOptions = {fileName};
      await updateHtml(htmlUrl, httpOptions);

      expect(fs.statSync(fileName).size).toBeTruthy();
    });
  });

  describe('convertHtmlToVersionNumbers', () => {
    it('should get a version list', () => {
      const fileName = path.resolve('spec/support/files/android.html');
      const versionArray = convertHtmlToVersionNumbers(fileName);
      expect(versionArray[0]).toBe('sdk-tools-windows-4333796.zip');
      expect(versionArray[1]).toBe('sdk-tools-macosx-4333796.zip');
      expect(versionArray[2]).toBe('sdk-tools-linux-4333796.zip');
    });
  });
});
