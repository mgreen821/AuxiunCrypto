const GameAssests = artifacts.require('./GameAssests.sol')
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

require('chai').use(require('chai-as-promised')).should();


contract('GameAssests', (accounts) =>{
    let contract
    before(async () => {
        contract = await GameAssests.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully', async () =>{
            contract = await GameAssests.deployed()
            const address = contract.address
            console.log(address)
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);

        })
        it('has a name', async () =>{
            const name = await contract.name();
            assert.equal(name, 'Item')
        })
        it('has a symbol', async () =>{
            const symbol = await contract.symbol();
            assert.equal(symbol, 'ITM')
        })
    })

    describe('minting', async () => {
        it('creates a new token', async () =>{
            const result = await contract.createItem('thisismyuri.json');
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'From is correct')
            assert.equal(event.to, accounts[0], 'to is correct');
        })
    })

    describe('balance of', async () =>{
        it('checks owners balance', async () => {
            const result = await contract.getBalance('0xc089A74208bFda7A2956819480EaF4F9C2cafB04');
            assert.equal(result, 1);
        })
    })


    describe('transfer item', async () =>{
        it('checks if item was transfered', async () => {
            const result = await contract.transferItem("0xc089A74208bFda7A2956819480EaF4F9C2cafB04", "0x63aE3001c20F29A7d08bC2315dc75f35fe4450F8", 1)
            const event = result.logs[1].args;
            const owner = await contract.ownerOfToken(1);
            console.log(owner);
            assert.equal(event.from, '0xc089A74208bFda7A2956819480EaF4F9C2cafB04');
            assert.equal(event.to, '0x63aE3001c20F29A7d08bC2315dc75f35fe4450F8');
            assert.equal(event.tokenId, 1);
            assert.equal(owner, "0x63aE3001c20F29A7d08bC2315dc75f35fe4450F8");
        })
    })

    describe('check token uri', async () =>{
        it('get uri', async () => {
            const result = await contract.getTokenURI(1);
            console.log(result);
            assert.equal(result,'thisismyuri.com');
        })
    })
})

