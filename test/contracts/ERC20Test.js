
const ERC20 = artifacts.require('ERC20');
const { expect } = require('chai');
const BigNumber= require("bignumber.js")


contract('ERC20', (accounts) => {

    beforeEach(async function () {
        this.token = await ERC20.new('Argan Token', 'ARG', 18, 100,{ from: accounts[0]});
    });

    it('has a name', async function () {
        expect(await this.token.name()).to.equal('Argan Token');
    });

    it('has a symbol', async function () {
        expect(await this.token.symbol()).to.equal('ARG');
    });

    it('has 18 decimals', async function () {
        let result = await this.token.decimals();
        expect(result.toString()).to.equal('18');
    });

    it('assigns the initial total supply to the creator', async function () {
        const totalSupply = await this.token.totalSupply();
        const creatorBalance = await this.token.balanceOf(accounts[0]);
        assert.equal(BigNumber(totalSupply).eq(new BigNumber(creatorBalance)), true)
    });

    it('transfer 10000 to accounts[1]', async function () {
        let amount = new BigNumber(10000);
        let prevOwnerBalance = await this.token.balanceOf(accounts[0]);
        let trxReceipts = await this.token.transfer(accounts[1], amount, { from: accounts[0]} );
        let receiverBalance = await this.token.balanceOf(accounts[1]);
        let ownerBalance = await this.token.balanceOf(accounts[0]);
        assert.equal(BigNumber(amount).eq(new BigNumber(receiverBalance)), true)
        assert.equal(BigNumber(ownerBalance).eq(new BigNumber(prevOwnerBalance).minus(amount)), true)
        assert.isNotNull(trxReceipts)
    });

    it('approve 10000 for allowance to accounts[1]', async function () {
        let amount = new BigNumber(10000);
        let trxReceipts = await this.token.approve(accounts[1], amount, { from: accounts[0]});
        let receiverAllowance = await this.token.allowance(accounts[0], accounts[1]);
        assert.equal(BigNumber(amount).eq(new BigNumber(receiverAllowance)), true)
        assert.isNotNull(trxReceipts)
    });

    it('approve 10000 for allowance to accounts[1] then account[0] make transfer with amount exceeded ', async function () {
        let amount = new BigNumber(10000);
        let amountExceed = new BigNumber(20000);

        let trxReceipts = await this.token.approve(accounts[1], amount, { from: accounts[0]});
        let receiverAllowance = await this.token.allowance(accounts[0], accounts[1]);
        assert.equal(BigNumber(amount).eq(new BigNumber(receiverAllowance)), true);
        assert.isNotNull(trxReceipts)
        try {
            let trxReceiptsTransferFrom = await this.token.transferFrom(accounts[0], accounts[2], amountExceed, { from: accounts[1]});
        }catch (e) {
            assert.equal(e.message.includes("ERC20: Transfer Amount Exceeds Than Allowance"), true);
        }
    });


    it('failed approve 10000 for allowance to accounts[1] then account[0] make transfer to account [2]', async function () {
        let amount = new BigNumber(10000);
        let prevOwnerBalance = await this.token.balanceOf(accounts[0]);
        let trxReceipts = await this.token.approve(accounts[1], amount, { from: accounts[0]});
        let receiverAllowance = await this.token.allowance(accounts[0], accounts[1]);
        assert.equal(BigNumber(amount).eq(new BigNumber(receiverAllowance)), true);
        assert.isNotNull(trxReceipts)
        let trxReceiptsTransferFrom = await this.token.transferFrom(accounts[0], accounts[2], amount, { from: accounts[1]});
        let ownerBalance = await this.token.balanceOf(accounts[0]);
        let receiverBalance = await this.token.balanceOf(accounts[2]);
        assert.isNotNull(trxReceiptsTransferFrom)
        assert.equal(BigNumber(receiverBalance).eq(new BigNumber(amount)), true);
        assert.equal(BigNumber(ownerBalance).eq(new BigNumber(prevOwnerBalance).minus(amount)), true)
    });

});
