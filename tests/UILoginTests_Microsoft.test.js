const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const edge = require('selenium-webdriver/edge');
// const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless');
// const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
const driver = new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(new edge.Options()).build();

var server;

before(async function () {
    server = await new Promise((resolve) => {
        server = app.listen(0, 'localhost', () => {
            resolve(server);
        });
    })
});

describe('Testing Index Screen', function () {

    this.timeout(100000); // Set timeout as 10 seconds

    it('Should show title: OCBC', async () => {
        await driver.get('http://localhost:5050/');
        const title = await driver.getTitle(); // Get the title of the web page
        expect(title).to.equal("OCBC"); // Assert that title matches "Swag Labs"
    });

    it('Should login successfully', async function () {
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
        await driver.wait(until.urlIs(baseUrl + '/home.html'), 10000);


        // Locate and interact with the Login button
        const transferButtonModal = await driver.findElement(By.id('transferModalButton'));
        await transferButtonModal.click();

        // Wait for recipient element to be present
        const recipientElement = await driver.findElement(By.id('recipient'));
        await driver.wait(until.elementIsVisible(recipientElement), 5000);
        await recipientElement.click();
        await recipientElement.sendKeys('john@gmail.com');

        // Wait for amount element to be present
        const amountElement = await driver.findElement(By.id('amount'));
        await amountElement.click();
        await amountElement.sendKeys('100');

        const descElement = await driver.findElement(By.id('desc'));
        await descElement.click();
        await descElement.sendKeys('Lunch');

        // Locate the table element and locate all tr within table
        const tableBefore = await driver.findElement(By.tagName('table')); // Replace with the actual ID of your table
        const rowsBefore = await tableBefore.findElements(By.tagName('tr'));
        const beforeCount = rowsBefore.length

        // CLick for transfer button
        const transferButton = await driver.findElement(By.id('transferButton'));
        await transferButton.click(); // Locate and interact with the Login button

        // Wait for the modal to dismiss
        await driver.manage().setTimeouts({ implicit: 5000 });

        // Locate the table element and locate all tr within table
        const tableUpdated = await driver.findElement(By.tagName('table'));
        const rowsUpdated = await tableUpdated.findElements(By.tagName('tr'));

        // Assert that the table rows increased by 1
        expect(rowsUpdated.length).to.equal(beforeCount + 1);

    });


});
after(async function () {
    await driver.quit();
    await server.close()
    process.exit(0)
});
