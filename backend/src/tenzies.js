const {getGameOfDoc} = require("./firebase/functions/read/getGameData")
const {updateGameOf} = require("./firebase/functions/write/writeGameData")
const {ethers} = require("ethers")
const {tenziesAbi} = require("./tenziesAbi")
require("dotenv").config()

const provider = new ethers.providers.JsonRpcProvider("https://public.stackup.sh/api/v1/node/arbitrum-sepolia")
// "https://json-rpc.rolxtwo.evm.ra.blumbus.noisnemyd.xyz")
const contractAddress = "0x28051bbc50E5274024e9A36c89De314877696ca8";

async function finishGame(code, winner) {
    try {
        // Create a new wallet instance using the private key
        const wallet = new ethers.Wallet(process.env.PRIVATEKEY, provider);

        // Connect to the contract using the contract ABI and address
        const contract = new ethers.Contract(contractAddress, tenziesAbi, wallet);

        // Prepare the transaction data
        const transaction = await contract.finishGame(code, winner);

        // Sign and send the transaction
        const result = await wallet.sendTransaction(transaction);

        console.log("Transaction sent:", result.hash);
        return true
    } catch (error) {
        console.error("Error sending transaction:", error);
        return false
    }
}

async function getGameData(code) {
    try {

        // Connect to the contract using the contract ABI and address
        const contract = new ethers.Contract(contractAddress, tenziesAbi, provider);

        // Prepare the transaction data
        const data = await contract.getGameDetails(code);

        return {status: true, data: data}
    } catch (error) {
        console.error("Error :", error);
        return {status: false, data: null}
    }
}

async function main(){
    const userAddress = "0xc01cee8a56D4F40862ffb574665380f2507a8bBC"
    // await rollDice("", userAddress, 1)
    await freezeDice("", userAddress, userAddress, 0)
    const data = await getGameOfDoc(userAddress)
    console.log(data)
}

async function rollDice(code, userAddress) {
    try{
        const docId = userAddress.toLowerCase() + code.toLowerCase() 
        const gameData = await getGameData(code)
        if(!gameData.status)return {status : false, message: "unable to get the data"};
        if(gameData.data[0] == "0x0000000000000000000000000000000000000000") return {status : false, message: "invalid code"};
        if(gameData.data[1] == "0x0000000000000000000000000000000000000000") return {status : false, message: "game is yet to start"};
    
        // Step 1: Get the current Unix timestamp in seconds
        const timestamp = Math.floor(Date.now() / 1000);
    
        // Step 2: Generate a random number between 1 and 6 (inclusive)
        const newValue = Math.floor(Math.random() * 6) + 1;
    
        const data = await getGameOfDoc(docId)
    
        if(!data.exist) return {status : false, message: "unable to get the data"};
        let newDice = []
        
        for(let i = 0; i< data.doc.freeze.length ; i++){
            const newValue = Math.floor(Math.random() * 6) + 1;
            if(data.doc.freeze[i] == true) newDice[i] = data.doc.dices[i];
            else newDice[i] = newValue;

        }
    
        // update dice information
        await updateGameOf(docId, {
            dices: newDice,
            finished_at: data.doc.finished_at,
            freeze: data.doc.freeze
        })

        return {status : true, message: ""}; 
    } catch(error){
        console.log(error)
        return {status : false, message: "unable to get the data"}; 
    } 
}

async function freezeDice(code, userAddress, opponentAddress, diceIndex){
    try{
        const docId = userAddress.toLowerCase() + code.toLowerCase() 

        const timestamp = Math.floor(Date.now() / 1000);
    
        const data = await getGameOfDoc(docId)
        const oppData = await getGameOfDoc(opponentAddress.toLowerCase() + code.toLowerCase())
    
        if(!data.exist) return false
        if(data.doc.finished_at != 0)return false
    
        if(oppData.doc.finished_at != 0)return false
    
        let isWin = true
        for(const item of data.doc.dices){
            if(data.doc.dices[0] != item) isWin = false;
        }
        for(let i = 0; i< data.doc.freeze.length; i++){
            if(i == diceIndex) continue;
            if(data.doc.freeze[i] != true ) isWin = false;
        }
    
        const newFreeze = data.doc.freeze
        newFreeze[diceIndex] = !newFreeze[diceIndex]
        
        // update dice information
        await updateGameOf(docId, {
            dices: data.doc.dices,
            finished_at: isWin ? timestamp : data.doc.finished_at,
            freeze: newFreeze
        })
    
        if(isWin){
            // update onchain
            await finishGame(userAddress, code)
        }
    
        return {status: true, isWin: isWin}
    } catch(error){
        console.log(error)
        return {status : false, message: "unable to get the data"}; 
    } 
    
}

async function createGame(code, userAddress) {
    try{
        console.log(code, userAddress)
        const docId = userAddress.toLowerCase() + code.toLowerCase() 
        const gameData = await getGameOfDoc(docId)
        if(gameData.exist)return {status : false, message: "Game is Already created"};
        let newDice = [];

        // Generate and add 10 random values to the newDice list
        for (let i = 0; i < 10; i++) {
            const newValue = Math.floor(Math.random() * 6) + 1;
            newDice.push(newValue);
        }
        const data = {
            dices: newDice,
            finished_at: 0,
            freeze: [false, false, false, false, false, false, false, false, false, false]
        }

        // update dice information
        await updateGameOf(docId, data)

        return {status : true, message: ""}; 
    } catch(error){
        console.log(error)
        return {status : false, message: "unable to get the data"}; 
    } 
}

async function joinGame(code, userAddress) {
    try{
        const docId = userAddress.toLowerCase() + code.toLowerCase() 
        const gameData = await getGameOfDoc(docId)
        if(gameData.exist)return {status : true, message: "Game is Already started"};
        let newDice = [];

        // Generate and add 10 random values to the newDice list
        for (let i = 0; i < 10; i++) {
            const newValue = Math.floor(Math.random() * 6) + 1;
            newDice.push(newValue);
        }
        const data = {
            dices: newDice,
            finished_at: 0,
            freeze: [false, false, false, false, false, false, false, false, false, false]
        }

        // update dice information
        await updateGameOf(docId, data)

        return {status : true, message: ""}; 
    } catch(error){
        console.log(error)
        return {status : false, message: "unable to get the data"}; 
    } 
}

module.exports = {
    freezeDice,
    rollDice,
    createGame,
    joinGame
}