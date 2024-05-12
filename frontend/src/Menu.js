import React, { useState } from 'react';
import Die from "./components/Die";
import { nanoid } from "nanoid";
import ReactConfetti from "react-confetti";
import Scoreboard from "./components/Scoreboard";
import { ethers } from 'ethers'
import {createGameFn, joinGameFn, getGameDetails} from "./functions/tenzies"
import { useNavigate } from 'react-router-dom';
import {createGame, joinGame} from "./functions/api/firebase"
import {getConnectedWalletAddress} from "./functions/wallet"
import NavBar from "./components/NavBar";

import "./Game.css";

export default function Menu() {
    const navigate = useNavigate();
    // State for entry fee and game code
    const [entryFee, setEntryFee] = useState('');
    const [gameCode, setGameCode] = useState('');

    // Function to handle entry fee input change
    const handleEntryFeeChange = (event) => {
        setEntryFee(event.target.value);
    };

    // Function to handle game code input change
    const handleGameCodeChange = (event) => {
        setGameCode(event.target.value);
    };
    
    const handleCreateGame = async () => {
        if (!entryFee) {
          alert('Please enter an entry fee.');
          return;
        }
    
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const signer = provider.getSigner();
          // Assuming you have a signer object available
          // Call the createGame function
          const success = await createGameFn(signer, ethers.utils.parseEther(entryFee.toString()));
          if (success.status) {
            // console.log("await signer.getAddress() ", await signer.getAddress())
            const res = await createGame(success.code,await getConnectedWalletAddress())
            console.log("res ", res)
            if(res.status) navigate(`/game/${success.code}`);
            else alert('Failed to create game.');
          } else {
            alert('Failed to create game.');
          }
        } catch (error) {
          console.error('Error creating game:', error);
          alert('An error occurred while creating the game. Please try again.');
        }
    };

    const handleJoinGame = async () => {
        if (!gameCode) {
          alert('Please enter a code.');
          return;
        }
    
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

          // Assuming you have a signer object available
          // Call the createGame function
          const response = await getGameDetails(provider, gameCode)
          const success = await joinGameFn(signer,gameCode, response.data[2].toString());
          if (success.status) {
            const res = await joinGame(success.code, await getConnectedWalletAddress())
            if(res.status) navigate(`/game/${success.code}`);
            else alert('Failed to join game.');
          } else {
            alert('Failed to join game.');
          }
        } catch (error) {
          console.error('Error joining game:', error);
          alert('An error occurred while joining the game. Please try again.');
        }
    };

    // Function to render menu screen
    const renderMenuScreen = () => (
    <div className="menu-container">
      <h1 className="title">Tenzies Royale</h1>
        <br/>
        <div className="menu-inputs">
        <label htmlFor="entryFee" className="menu-label" >Entry Fee Amount:</label>
        <input type="number" id="entryFee" className="menu-input" value={entryFee} 
          onChange={handleEntryFeeChange} />
        </div>
        <button className="menu-button" onClick={handleCreateGame}>Create Game</button>
        <br/>
        <div className="menu-inputs">
        <label htmlFor="gameCode" className="menu-label">Game Code:</label>
        <input type="text" id="gameCode" className="menu-input" value={gameCode} 
          onChange={handleGameCodeChange} />
        </div>
        <button className="menu-button" onClick={handleJoinGame}>Join Game</button>
    </div>
    );
  return (
    <>
      <div className="app-container shadow-shorter">
        <NavBar/>
        <main>
          {renderMenuScreen()}
        </main>
      </div>
    </>
  );
}
