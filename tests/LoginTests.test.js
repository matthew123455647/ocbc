const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const { login } = require('../utils/AccountUtil')

describe('Testing Login Function', () => {
    const usersFilePath = 'utils/accounts.json';
    var orgContent = "";

    beforeEach(async () => {
        orgContent = await fs.readFile(usersFilePath, 'utf8');
        orgContent = JSON.parse(orgContent);
    });

    afterEach(async () => {
        await fs.writeFile(usersFilePath, JSON.stringify(orgContent), 'utf8');
    });

    it('Should login successfully', async () => {
        const req = {
            body: {
                email: 'simon@gmail.com',
                password: '123456',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(201);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Login successful!');
            },
        };
        await login(req, res);
    });

    it('Should login successfully', async () => {
        const req = {
            body: {
                email: 'simon@gmail.com',
                password: '12345',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid credentials!');
            },
        };
        await login(req, res);
    });
});