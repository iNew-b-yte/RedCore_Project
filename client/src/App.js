import React, { Component } from "react";
import RedCore from "./contracts/RedCore.json";
import RedCoreSale from "./contracts/RedCoreSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded:false , kycAddress :"0x123...",RedCoreSaleAddress:null, userTokens:0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.RedCoreInstance = new this.web3.eth.Contract(
        RedCore.abi,
        RedCore.networks[this.networkId] && RedCore.networks[this.networkId].address,
      );
      this.RedCoreSaleInstance = new this.web3.eth.Contract(
        RedCoreSale.abi,
        RedCoreSale.networks[this.networkId] && RedCoreSale.networks[this.networkId].address,
      );
      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({loaded:true , RedCoreSaleAddress:RedCoreSale.networks[this.networkId].address},this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async ()=> {
    let userTokens = await this.RedCoreInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens:userTokens});
  }

  listenToTokenTransfer =  ()=>{
    this.RedCoreInstance.events.Transfer({to:this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleBuyTokens = async ()=>{
    await this.RedCoreSaleInstance.methods.buyTokens(this.accounts[0]).send({from:this.accounts[0], value:this.web3.utils.toWei("1","wei")});
  }
  

  handleInputChange = (events)=>{
    const target = events.target;
    const value = target.type ==="checkbox"? target.checked: target.value;
    const name = target.name;
    this.setState({
      [name]:value
    });
   }

   handleKycWhitelisting = async() => {
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({from:this.accounts[0]});
    alert("Kyc for "+this.state.kycAddress+" is completed");
   }
  
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Redcore Token Sale</h1>
        <p>Get your Tokens today!</p>
        <h2>Kyc Whitelisting</h2>
        Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
        <h2>Buy Tokens</h2>
        <p>If you want to buy tokens, send wei to this address : {this.state.RedCoreSaleAddress}</p>
        <p>You currently have : {this.state.userTokens} RDCORE TOKENS</p>
        <button type="button" onClick={this.handleBuyTokens}>Buy more Tokens</button>
      </div>
    );
  }
}

export default App;
