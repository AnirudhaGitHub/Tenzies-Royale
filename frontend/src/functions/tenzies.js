const {ethers} = require("ethers")
const {tenziesAbi} = require("../constants/abi/tenzies")

const dexAddress = '0x28051bbc50E5274024e9A36c89De314877696ca8';

export async function createGameFn(signer, fee) {
    try {
      // Create a new instance of the contract
      const contract = new ethers.Contract(dexAddress, tenziesAbi, signer);
      
      const tx = await contract.createGame(fee, {gasLimit: "1000000", value: fee});
      console.log('Transaction hash:', tx.hash);
  
      // Wait for the transaction to be confirmed
      const receipt = await tx.wait();
      
      const counter = await contract.gameCounter();
      const code = await contract.generateGameCode(counter - 1);
      console.log('Transaction confirmed:', receipt);
      return {status: true, code: code}
    } catch (error) {
      console.error('Error createGameFn:', error);
      return {status: false}
    }
}

export async function joinGameFn(signer, code, fee) {
    try {
      // Create a new instance of the contract
      const contract = new ethers.Contract(dexAddress, tenziesAbi, signer);
      
      const tx = await contract.acceptGame(code, {gasLimit: "1000000", value: fee});
      console.log('Transaction hash:', tx.hash);
  
      // Wait for the transaction to be confirmed
      const receipt = await tx.wait();
    
      console.log('Transaction confirmed:', receipt);
      return {status: true, code: code}
    } catch (error) {
      console.error('Error joinGameFn:', error);
      return {status: false}
    }
}


export async function getGameDetails(provider, code) {
    try {
      // Create a new instance of the contract
      const contract = new ethers.Contract(dexAddress, tenziesAbi, provider);
      
      const tx = await contract.getGameDetails(code);
      return {status: true, data: tx}
    } catch (error) {
      console.error('Error joinGameFn:', error);
      return {status: false}
    }
}