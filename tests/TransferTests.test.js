const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const { transfer } = require('../utils/AccountUtil')

describe('Testing Transfer Function', () => {
    const usersFilePath = 'utils/accounts.json';
    var orgContent = "";

    beforeEach(async () => {
        orgContent = await fs.readFile(usersFilePath, 'utf8');
        orgContent = JSON.parse(orgContent);
    });

    afterEach(async () => {
        await fs.writeFile(usersFilePath, JSON.stringify(orgContent), 'utf8');
    });

    it('Should Transfer successfully', async () => {
        const req = {
            body: {
                sender: 'simon@gmail.com',
                receiver: 'john@gmail.com',
                amount: '200',
                desc: 'Lunch'
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(201);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Transfer successful!');
            },
        };
        await transfer(req, res);
    });

    it('Should transfer amount exceed balance ', async () => {
        const req = {
            body: {
                sender: 'simon@gmail.com',
                receiver: 'john@gmail.com',
                amount: '5000',
                desc: 'Lunch'
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(201);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Transfer amount exceeds balance!');
            },
        };
        await transfer(req, res);
    });

    it('Should receiver email is wrong', async () => {
        const req = {
            body: {
                sender: 'simon@gmail.com',
                receiver: 'jon@gmail.com',
                amount: '40',
                desc: 'Lunch'
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid operation!');
            },
        };
        await transfer(req, res);
    });

    it('Should sender email is wrong', async () => {
        const req = {
            body: {
                sender: 'simn@gmail.com',
                receiver: 'john@gmail.com',
                amount: '40',
                desc: 'Lunch'
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid operation!');
            },
        };
        await transfer(req, res);
    });
});