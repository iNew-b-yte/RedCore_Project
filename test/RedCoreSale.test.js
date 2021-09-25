const Token = artifacts.require("RedCore");
const TokenSale = artifacts.require("RedCoreSale");
const KycContract = artifacts.require("KycContract");

const chai = require("./ChaiSetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;
require("dotenv").config({path:"../.env"});

contract("TokenSale Test", async (accounts) => {
    const [deployerAccount, recipient, anotherAccount] = accounts;

   it("should not have any tokens in my deployerAccount", async ()=>{
    let instance = await Token.deployed();
    return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
   }); 

   it("all tokens should be in the RedCoreSale Smart Contract by default",async()=>{
        let instance  = await Token.deployed();
        let balanceOfTokenSmartContract = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
       return expect(balanceOfTokenSmartContract).to.be.a.bignumber.equal(totalSupply);
   });
   it("should be possible to buy tokens",async()=>{
        let tokenInstance  = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let kycInstance = await KycContract.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        await kycInstance.setKycCompleted(deployerAccount, {from:deployerAccount});
        expect(tokenSaleInstance.sendTransaction({from : deployerAccount,value : web3.utils.toWei("1","wei")})).to.be.fulfilled;
        
       return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(0)));

   });
});