console.info('Running web scraper...')

const {Builder, Capabilities} = require('selenium-webdriver');
const path                    = require('path');
const driver                  = createWebDriver();
const jsTimeout               = 30000;

// Load a javascript-enabled page.
driver.get('https://examples.dynamicip.com/single-page-apps/basic');

// Wait for javascript. This particular solution is specific to jQuery.
driver.wait(() => driver.executeScript('return jQuery.active === 0'), jsTimeout);

// Extract DOM.
driver.executeScript('return document.documentElement.outerHTML').then(onPageLoad).catch(onPageError);

// Display the result.
function onPageLoad(renderedHTML) {
  console.info('Page response:')
  console.log(renderedHTML);
  driver.quit();
}

// Display errors (if any).
function onPageError(error) {
  console.error(error);
  driver.quit();
}

function createWebDriver() {
  const chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set('chromeOptions', {
    'args': [
      // Configure Chrome to use DynamicIP as a proxy.
      '--proxy-server=https://dynamicip.com:443',

      // Perform proxy authentication via a custom plugin (see 'chrome_extension' dir).
      `--load-extension=${path.resolve(__dirname, 'chrome_extension')}`
    ],
    'excludeSwitches': [
      // ChromeDriver's default behaviour is to allow invalid certificates.
      // To improve security, we explicitly unset this flag here.
      'ignore-certificate-errors'
    ]
  });
  return new Builder()
    .withCapabilities(chromeCapabilities)
    .build();
}