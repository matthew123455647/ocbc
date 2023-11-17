const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const { transfer } = require('../utils/AccountUtil');

// Test suite for the transfer function
describe('Testing Transfer Function', () => {
    // File path for storing user accounts data
    const usersFilePath = 'utils/accounts.json';
    // Variable to store the original content of the user accounts file
    var orgContent = "";

    // Before each test, read the original content of the user accounts file
    beforeEach(async () => {
        orgContent = await fs.readFile(usersFilePath, 'utf8');
        orgContent = JSON.parse(orgContent);
    });

    // After each test, restore the original content of the user accounts file
    afterEach(async () => {
        await fs.writeFile(usersFilePath, JSON.stringify(orgContent), 'utf8');
    });

    // Test case for successful transfer
    it('Should Transfer successfully', async () => {
        const req = {
            body: {
                sender: 'simon@gmail.com',
                receiver: 'john@gmail.com',
                amount: '200',
                desc: 'Lunch',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(201); // Asserting the status code
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Transfer successful!'); // Asserting the response message
            },
        };
        await transfer(req, res);
    });

    // Test case for transferring an amount that exceeds the sender's balance
    it('Should transfer amount exceed balance ', async () => {
        const req = {
            body: {
                sender: 'simon@gmail.com',
                receiver: 'john@gmail.com',
                amount: '5000', // Exceeding the balance
                desc: 'Lunch',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(201); // Asserting the status code (you may want to use a different status code)
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Transfer amount exceeds balance!'); // Asserting the response message
            },
        };
        await transfer(req, res);
    });

    // Test case for an invalid receiver email
    it('Should receiver email is wrong', async () => {
        const req = {
            body: {
                sender: 'simon@gmail.com',
                receiver: 'jon@gmail.com', // Invalid receiver email
                amount: '40',
                desc: 'Lunch',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(500); // Asserting the status code
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid operation!'); // Asserting the response message
            },
        };
        await transfer(req, res);
    });

    // Test case for an invalid sender email
    it('Should sender email is wrong', async () => {
        const req = {
            body: {
                sender: 'simn@gmail.com', // Invalid sender email
                receiver: 'john@gmail.com',
                amount: '40',
                desc: 'Lunch',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(500); // Asserting the status code
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid operation!'); // Asserting the response message
            },
        };
        await transfer(req, res);
    });
});