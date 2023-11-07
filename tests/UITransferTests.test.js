const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const chrome = require('selenium-webdriver/chrome');
// const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless');
// const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
const driver = new Builder().forBrowser('chrome').build();

var server;

before(async function () {
    server = await new Promise((resolve) => {
        server = app.listen(0, 'localhost', () => {
            resolve(server);
        });
    })
});

describe('Testing Home Screen', function () {

    this.timeout(100000); // Set timeout as 10 seconds

    it('Should show title: OCBC', async () => {
        await driver.get('http://localhost:5050/');
        const title = await driver.getTitle(); // Get the title of the web page
        expect(title).to.equal("OCBC"); // Assert that title matches "Swag Labs"
  });

  
  it('Should Transfer successfully', async function () {
    const baseUrl = 'http://localhost:' + server.address().port;
    await driver.get(baseUrl);

    // Locate and interact with the email field
    const emailElement = await driver.findElement(By.id('email'));
    await emailElement.click(); // Click on the element
    await emailElement.sendKeys('simon@gmail.com');

    // Locate and interact with the email field
    const passwordElement = await driver.findElement(By.id('password'));
    await passwordElement.click(); // Click on the element
    await passwordElement.sendKeys('123456');

    // Locate and interact with the Login button
    const loginButton = await driver.findElement(By.id('loginbutton'));
    await loginButton.click();

    // Wait for the page to be redirected
    await driver.wait(until.urlIs(baseUrl + '/main.html'), 10000);

    // Assert that the URL matches the expected URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('http://localhost:' + server.address().port + '/main.html')

    });

  
  after(async function () {
    //await driver.quit();
    await server.close();
});

});  