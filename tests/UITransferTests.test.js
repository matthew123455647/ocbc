const { app } = require('../index');
const { Builder, By, until } = require('selenium-webdriver');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const chrome = require('selenium-webdriver/chrome');
const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--headless');
const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

var server;

before(async function () {
  server = await new Promise((resolve) => {
    server = app.listen(0, 'localhost', () => {
      resolve(server);
    });
  });
});

describe('Testing Money Transfer', function () {
  // Set timeout as 10 seconds

  it('Should Transfer successfully', async function () {
    const baseUrl = 'http://localhost:' + server.address().port;
    await driver.get(baseUrl);
    await driver.wait(until.urlIs(baseUrl + '/home.html'), 15000); // Increase timeout to 15 seconds
    // Wait for recipient element to be present
    const recipientElement = await driver.wait(until.elementLocated(By.id('recipient')), 10000);
    await recipientElement.click();
    await recipientElement.sendKeys('simon@gmail.com');

    // Wait for amount element to be present
    const amountElement = await driver.wait(until.elementLocated(By.id('amount')), 10000);
    await amountElement.click();
    await amountElement.sendKeys('100');

    const descElement = await driver.wait(until.elementLocated(By.id('desc')), 10000);
    await descElement.click();
    await descElement.sendKeys('Lunch');

    // Wait for transfer button to be present
    const transferButton = await driver.wait(until.elementLocated(By.id('transferButton')), 10000);
    await transferButton.click();

    // Wait for the transfer to complete (adjust this condition based on your application behavior)
  

    // Assert that the URL matches the expected URL for a successful transfer
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal(`${baseUrl}/home.html`);
  });

  after(async function () {
    await driver.quit();
  });
});