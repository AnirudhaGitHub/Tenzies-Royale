const {getGameOfDoc} = require("./firebase/functions/read/getGameData")
const {updateGameOf} = require("./firebase/functions/write/writeGameData")
const {ethers} = require("ethers")

const provider = ethers.providers.JsonRpcProvider("")
// "https://json-rpc.rolxtwo.evm.ra.blumbus.noisnemyd.xyz")
const contractAddress = "0xaf411f5D4c82E39FE439167623e83607A560366E";

async function finishGame(code, winner) {
    try {
        // Create a new wallet instance using the private key
        const wallet = new ethers.Wallet(privateKey, provider);

        // Connect to the contract using the contract ABI and address
        const contract = new ethers.Contract(contractAddress, [`function finishGame(bytes memory _gameCode, address winner) external`], wallet);

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
        const contract = new ethers.Contract(contractAddress, [`function getGameDetails(bytes memory _gameCode) external view returns (address, address, uint256, bytes memory, bool, address, bool)`], provider);

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

async function rollDice(code, userAddress, diceIndex) {
    try{
        const docId = userAddress.toLowercase() + code.toLowercase() 
        const gameData = await getGameData(code)
        if(!gameData.status)return {status : false, message: "unable to get the data"};
        if(gameData.data[0] == "0x0000000000000000000000000000000000000000") return {status : false, message: "invalid code"};
    
        // Step 1: Get the current Unix timestamp in seconds
        const timestamp = Math.floor(Date.now() / 1000);
    
        // Step 2: Generate a random number between 1 and 6 (inclusive)
        const newValue = Math.floor(Math.random() * 6) + 1;
    
        const data = await getGameOfDoc(docId)
    
        if(!data.exist) return {status : false, message: "unable to get the data"};
        if(data.doc.freeze[diceIndex])return {status : false, message: "dice is freeze"};
    
        let newDice = data.doc.dices
        newDice[diceIndex] = newValue
        console.log(newValue, "new")
    
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
        const docId = userAddress.toLowercase() + code.toLowercase() 

        const timestamp = Math.floor(Date.now() / 1000);
    
        const data = await getGameOfDoc(docId)
        const oppData = await getGameOfDoc(opponentAddress.toLowercase() + code.toLowercase())
    
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

main()