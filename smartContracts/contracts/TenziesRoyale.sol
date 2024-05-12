// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TenziesRoyale {
    struct Game {
        address player1;
        address player2;
        uint256 buyInAmount;
        bytes gameCode;
        bool gameStarted;
        address winner;
        bool IsClaim;
    }

    mapping(bytes => Game) games;
    uint256 public gameCounter;
    address public owner;

    constructor() {
        gameCounter = 1; // Start game counter from 1
        owner = msg.sender;
    }

    function createGame(uint256 _buyInAmount) external payable {
        require(msg.value == _buyInAmount, "_buyInAmount != msg.value");
        bytes memory gameCode = generateGameCode(gameCounter);
        games[gameCode] = Game(msg.sender, address(0), _buyInAmount, gameCode, false, address(0), false);
        gameCounter++;
    }

    function acceptGame(bytes memory _gameCode) external payable {
        Game storage game = games[_gameCode];
        require(game.player1 != address(0), "Game does not exist");
        require(!game.gameStarted, "Game has already started");
        require(msg.sender != game.player1, "Player1 cannot accept their own request");
        require(msg.value == game.buyInAmount, "Incorrect buy-in amount");

        game.player2 = msg.sender;
        game.gameStarted = true;
    }

    function getGameDetails(bytes memory _gameCode) external view returns (address, address, uint256, bytes memory, bool, address, bool) {
        Game storage game = games[_gameCode];
        return (game.player1, game.player2, game.buyInAmount, game.gameCode, game.gameStarted, game.winner, game.IsClaim);
    }

    function withdraw(bytes memory _gameCode) external {
        Game storage game = games[_gameCode];
        require(game.gameStarted, "Game has not started yet");
        require(msg.sender == game.player1, "You are not part of the game");

        payable(msg.sender).transfer(game.buyInAmount);

        delete games[_gameCode];
    }

    function claimWin(bytes memory _gameCode) external {
        Game storage game = games[_gameCode];
        require(game.gameStarted, "Game has not started yet");
        require(address(0) != game.winner, "winner not declared yet");
        require(msg.sender == game.winner, "You are not the winner");
        require(game.IsClaim == false, "already claimed");
        game.IsClaim = true;
        payable(msg.sender).transfer(game.buyInAmount + game.buyInAmount);

        delete games[_gameCode];
    }

    function generateGameCode(uint256 _gameId) public pure returns (bytes memory) {
        return abi.encode(_gameId);
    }

    function finishGame(bytes memory _gameCode, address winner) external {
        require(msg.sender == owner, "Only Owner");
        Game storage game = games[_gameCode];
        require(winner == game.player1 || winner == game.player2, "Invalid winner");
        game.winner = winner;
    }
}
