import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import ReactConfetti from "react-confetti";
import Scoreboard from "./components/Scoreboard";
import { rollDice, getGame, freezeDice } from "./functions/api/firebase";
import { getGameDetails, claimReward } from "./functions/tenzies";
import { useParams } from 'react-router-dom';
// import { Web3OnboardProvider, init, useConnectWallet } from '@web3-onboard/react'
// import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import {getConnectedWalletAddress} from "./functions/wallet"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import NavBar from "./components/NavBar";

import "./Game.css";
// const INFURA_KEY = ''
// const rollAppX = {
//   id: 100004,
//   token: 'RAX',
//   label: 'Rollapp X',
//   rpcUrl: 'https://json-rpc.rolxtwo.evm.ra.blumbus.noisnemyd.xyz'
// }
// const chains = [rollAppX]
// const wallets = [injectedModule()]

export default function Game() {
  const { game } = useParams();
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [oppAddress, setOpp] = React.useState(null);
  const [isLose, setIsLose] = React.useState(false);

  React.useEffect(() => {
    // Call the function to get the connected wallet address
    getConnectedWalletAddress().then((address) => {
      // Set the wallet address in the state
      setWalletAddress(address);
    });
  }, [window.ethereum]);
  
  const handleClaim = async () => {

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

      // Assuming you have a signer object available
      // Call the createGame function
      const success = await claimReward(signer, game);
      if (success) {
        alert('Claimed sucessfully');
      } else {
        alert('Failed to claim the rewards');
      }
    } catch (error) {
      console.error('Error claiming:', error);
      alert('Failed to claim the rewards. Please try again.');
    }
};

  // const web3Onboard = init({
  //   wallets,
  //   chains,
  //   appMetadata: {
  //     name: 'Tenzies Royale',
  //     icon: '<svg>App Icon</svg>',
  //     description: 'Tenzies Royale'
  //   }
  // })
  
  // Create state to hold our array of numbers
  const [dice, setDice] = React.useState(allNewDice());

  // Create state to hold our game state
  const [tenzies, setTenzies] = React.useState(false);

  // Create and initialize states to hold rolls stats
  const [rolls, setRolls] = React.useState(0);
  const [bestRolls, setBestRolls] = React.useState(
    JSON.parse(localStorage.getItem("bestRolls")) || 0
  );

  // const [seconds, setSeconds] = React.useState(0);
  // const [milliSeconds, setMilliSeconds] = React.useState(0);
  const [bestTime, setBestTime] = React.useState(
    JSON.parse(localStorage.getItem("bestTime")) || 0
  );

  async function get(){
    const data =  await getGame(game, await getConnectedWalletAddress())
    console.log(data, "data")
    if(data.exist){
      let dicelist = []

      for(let i = 0 ; i< 10; i++){
        dicelist.push({
          value: data.doc.dices[i],
          isHeld: data.doc.freeze[i],
          id: i.toString()
        })
      }

      if(data.doc.finished_at) setTenzies(true)

      setDice(dicelist)
    }
  }
  async function getOpp(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const res = await getGameDetails(provider, game)
    const opp = res.data[1].toLowerCase() == walletAddress ? res.data[0] : res.data[1]
    const isLose = res.data[5].toLowerCase() == "0x0000000000000000000000000000000000000000" ? false : (
      res.data[5].toLowerCase() == opp.toLowerCase() ? true : false
    )

    setOpp(opp)
    setIsLose(isLose)
  }
  React.useEffect(() => {
    
    getOpp()
  }, [game, walletAddress]);

  React.useEffect(() => {
    
    if(game)get()
      console.log("game", game)
  }, [game, walletAddress]);

  // useEffect to sync 2 different states together
  React.useEffect(() => {
    // Check all dice are held
    const allHeld = dice.every((die) => die.isHeld);
    // Check all dice have same value
    // Check if every die's value has the same one as the first die in dice array
    const allSameValue = dice.every((die) => die.value === dice[0].value);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setStart(false);

      setRecords();
    }
  }, [dice]);

  function setRecords() {
    // Check if bestRolls doesn't exist or newest rolls are better than bestRolls if so reassign the variable
    if (!bestRolls || rolls < bestRolls) {
      setBestRolls(rolls);
    }

    // WHY (time / 10) ?
    const timeFloored = Math.floor(time / 10);
    // Check if bestTime doesn't exist or newest time is lower than bestTime if so reassign the variable
    if (!bestTime || timeFloored < bestTime) {
      setBestTime(timeFloored);
    }
  }

  // Set bestRolls to localStorage every item bestRolls changes
  React.useEffect(() => {
    localStorage.setItem("bestRolls", JSON.stringify(bestRolls));
  }, [bestRolls]);

  // Set bestTime to localStorage every item bestTime changes
  React.useEffect(() => {
    localStorage.setItem("bestTime", JSON.stringify(bestTime));
  }, [bestTime]);

  function getRandomInt() {
    // Math.ceil starts at 1 instead of 0
    return Math.ceil(Math.random() * 6);
  }

  function generateNewDie() {
    return {
      value: getRandomInt(),
      isHeld: false,
      // Use nanoid package to generate a unique key for every object
      id: nanoid(),
    };
  }

  function allNewDice() {
    // newDice is an array of objects
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  // Flip the `isHeld` property on the object in the array
  // that was clicked, based on the `id` prop passed into the function
  async function holdDice(id) {
    // Update dice state using old one
    const data = await freezeDice(game, walletAddress, oppAddress, id)
    if(data.isWin)setTenzies(true)
    await get()
  }

  // Map over the state numbers array to generate the array
  // of Die elements and render those in the App component
  const diceElements = dice.map((die) => {
    // Pass holdDice function down to each instance of the Die component
    // with a callback function with die.id as parameter
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    );
  });

  // Clicking the button should generate a new array of numbers
  // and set the `dice` state to that new array (thus re-rendering
  // the array to the page)
  async function rollDiceFe() {
    if (!tenzies) {
      const res = await rollDice(game, await getConnectedWalletAddress())
      // Update dice state using old one
      await get()
      // updateRolls();
    } else {
      // Reset the game if user won and click on button
      resetGame();
    }
  }

  function resetGame() {
    setTenzies(false);
    setDice(allNewDice());
    setRolls(0);
    setStart(true);
    setTime(0);
  }

  // Increase rolls counter updating previous state
  // function updateRolls() {
  //   return setRolls((oldRolls) => oldRolls + 1);
  // }

  // ----------------------------TIMER--------------------------------------- //

  const [time, setTime] = React.useState(0);
  const [start, setStart] = React.useState(true);

  React.useEffect(() => {
    let interval = null;
    if (start) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [start]);

  return (
      <div className="app-container shadow-shorter">
        <NavBar/>
        
        {tenzies && <ReactConfetti />}
        <main>
          <h1 className="title">Tenzies Royale</h1>
          {!tenzies && (
            <p className="instructions">
              Roll until all dice are the same.
              <br /> Click each die to freeze it at its current value between
              rolls.
            </p>
          )}
          {tenzies && <p className="winner gradient-text"> YOU WON!</p>}
          {isLose && <p style={{color: "red"}}> YOU LOST!</p>}

          <div className="dice-container">{diceElements}</div>


          <button className="roll-dice" onClick={tenzies ? handleClaim : rollDiceFe}>
            {tenzies ? "Claim" : "Roll"}
          </button>
          <br/>
          <CopyToClipboard text={game}>
            <div style ={{display : "flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "10px", cursor: "pointer"}}>
            <h4>{`${game.substring(0, 5)}...${game.substring(game.length - 5)}`}</h4>
            <button style={{backgroundColor:"grey", color: "white", width: "100px" , height :"30px", marginLeft: "5px"}}>Copy Code</button>
            </div>
          </CopyToClipboard>
        </main>
      </div>
  );
}
