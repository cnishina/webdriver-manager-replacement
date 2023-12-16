import {Chromium} from './chromium2';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('webdriver-manager');
log.setLevel('debug');

describe('chromium', () => {
  describe('class Chromium', () => {
  
    beforeAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    it('should download a config', async () => {
      const chromium = new Chromium({});
      chromium.osType = 'Darwin'
      const majorVersion = '120';
      await chromium.updateBinary('', majorVersion);
    });
  });
});