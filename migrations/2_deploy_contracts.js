const { default: Web3 } = require("web3");

var RedCore = artifacts.require("RedCore.sol");
var RedCoreSale = artifacts.require("RedCoreSale");
var KycContract = artifacts.require("KycContract");
require("dotenv").config({path:"../.env"});

module.exports = async function(deployer){
     let addr = await web3.eth.getAccounts();
     await deployer.deploy(RedCore, process.env.INITIAL_TOKENS);
     await deployer.deploy(KycContract);
     await deployer.deploy(RedCoreSale, 1, addr[0], RedCore.address,KycContract.address);
     let instance = await RedCore.deployed();
     await instance.transfer(RedCoreSale.address,process.env.INITIAL_TOKENS);

}