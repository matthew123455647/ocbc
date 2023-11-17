const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const { login } = require('../utils/AccountUtil');

// Test suite for the login function
describe('Testing Login Function', () => {
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

    // Test case for successful login
    it('Should login successfully', async () => {
        // Mock request object with valid user credentials
        const req = {
            body: {
                email: 'simon@gmail.com',
                password: '123456',
            },
        };
        // Mock response object with assertions for a successful login
        const res = {
            status: function (code) {
                expect(code).to.equal(201); // Asserting the status code
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Login successful!'); // Asserting the response message
            },
        };
        await login(req, res);
    });

    // Test case for unsuccessful login with invalid password
    it('Should login unsuccessfully with invalid password', async () => {
        const req = {
            body: {
                email: 'simon@gmail.com',
                password: '12345', // Invalid password
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(500); // Asserting the status code for server error
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid credentials!'); // Asserting the response message
            },
        };
        await login(req, res);
    });

    // Test case for unsuccessful login with invalid email
    it('Should login unsuccessfully with invalid email', async () => {
        const req = {
            body: {
                email: 'simn@gmail.com', // Invalid email
                password: '123456',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(500); // Asserting the status code for server error
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid credentials!'); // Asserting the response message
            },
        };
        await login(req, res);
    });
});