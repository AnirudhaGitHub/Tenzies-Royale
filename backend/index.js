const express = require('express');
const { rollDice, freezeDice, createGame, joinGame } = require('./src/tenzies');
const cors = require('cors');
const {getGameOfDoc} = require("./src/firebase/functions/read/getGameData")

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

// Route for rolling dice
app.post('/roll', async (req, res) => {
    const { code, userAddress, diceIndex } = req.body;
    const result = await rollDice(code, userAddress);
    res.json(result);
});

// Route for freezing dice
app.post('/freeze', async (req, res) => {
    const { code, userAddress, opponentAddress, diceIndex } = req.body;
    const result = await freezeDice(code, userAddress, opponentAddress, diceIndex);
    res.json(result);
});

app.post('/create', async (req, res) => {
    const { code, userAddress } = req.body;
    const result = await createGame(code, userAddress);
    res.json(result);
});

app.post('/join', async (req, res) => {
    const { code, userAddress } = req.body;
    const result = await joinGame(code, userAddress);
    res.json(result);
});

app.post('/getGame', async (req, res) => {
    const { code, userAddress } = req.body;
    const docId = userAddress.toLowerCase() + code.toLowerCase() 
    const data = await getGameOfDoc(docId);
    res.json(data);
});

app.get("/", (req, res)=> {
    res.json({data: "Tenzies API"})
})

app.listen(port, () => {
    console.log(`Express app listening at ${port}`);
});

module.exports = app;