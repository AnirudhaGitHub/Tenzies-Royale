# Tenzies Royale - Multiplayer game on Dymension RollApp X

![Tenzies Royale (2)](https://github.com/AnirudhaGitHub/Tenzies-Royale/assets/167628180/ef0aa754-8e18-4911-90df-f6b053042ff9)


Tenzies Royale is an engaging and competitive dice game where two players face off in a race to solve the "tenzies," achieved when all ten of their six-sided dice display the same number. Two Players  rolls their set of dice simultaneously, with the option to strategically freeze any dice showing the desired number while rerolling the rest to increase the chances of achieving the elusive tenzies. The game is a balance of speed and strategy as players must decide when to freeze dice and when to risk rerolling in pursuit of a winning combination. The player who successfully achieves tenzies first emerges victorious, adding an element of excitement and tension to each round. Tenzies Royale offers a thrilling experience of quick thinking, luck, and tactical decision-making, making it a favorite among players seeking fast-paced competitive fun.

## DAPP DEMO :

https://github.com/AnirudhaGitHub/Tenzies-Royale/assets/167628180/12096a36-988c-4a72-b758-859b0e6aa34f


## DAPP Deployment Link

https://tenzies-royale.vercel.app/

## Tech Stack used

frontend = React JS
smart Contract = solidity
build and testing environment = RollApp sdk and local EVM RollApp (the RollApp sdk is being used for creating a EVM rollapp for Tenzies royale where this game was built and tested.)
Backend = firebase (nodejs)


## How It Works?

1. Smart Contract:

The smart contract serves as the backbone of the game, managing the game's rules, logic, and state on the blockchain and some part of logic is also in web2 backend.
It includes functions to create new games, accept game invitations, roll dice, freeze dice, determine winners, and handle payouts.
The contract stores game data, such as player addresses, buy-in amounts, game codes, dice values, and game status (e.g., whether the game has started, finished, or is still ongoing).
Smart contracts are immutable once deployed, ensuring that game rules and outcomes remain transparent and tamper-proof.

### Tenzies Royale Smart Contract Functions

1. **Create New Games**
   - **Function**: `createGame(uint256 _buyInAmount)`
   - **Description**: Allows a player to create a new game with a specified buy-in amount.
   - **Actions**: Validates transaction value, generates a unique game code, initializes game with player's address, buy-in amount, and sets status to not started.

2. **Accept Game Invitations**
   - **Function**: `acceptGame(bytes memory _gameCode)`
   - **Description**: Allows a player to accept an existing game invitation by providing the game code and buy-in amount.
   - **Actions**: Validates game code and transaction value, updates game with second player's address, and marks game as started.

3. **Determine Winners and Handle Payouts**
   - **Function**: `finishGame(bytes memory _gameCode, address winner)`
   - **Description**: Determines the winner of a finished game and handles payouts.
   - **Actions**: Validates winner's address, declares winner, and transfers 2 * buy-in amount to winner.

These functions enable players to create, join, play, and resolve games in Tenzies Royale, ensuring fairness and security through smart contract execution.


2. Backend:

The backend acts as an intermediary between the user interface (UI) and the smart contract, handling user requests, processing game actions, handle game logic and interacting with the blockchain.
It consists of server-side code written in a programming language called JavaScript (using Node.js).
The backend communicates with the smart contract using a blockchain library like ethers.js to invoke smart contract functions and read contract state.
It handles user authentication, input validation, error handling, and game logic related to game flow and rules. Firebase database is being used to store web2 data.
Overall, these backend functions facilitate interaction with the Dymension Rollapp X smart contract, enabling game operations such as rolling dice, freezing dice, finalizing games, and retrieving game data.

## Contract deployment (On Dymension RollApp X)

Tenzies Royale Contract = 0x8B1e8eB93b255E0a3d273A6b24c68A2eC0f3647C 
