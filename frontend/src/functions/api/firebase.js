import  axios from 'axios';

const baseURL = 'https://tenzies-self.vercel.app'

// Function to roll dice
export async function rollDice(code, userAddress) {
  try {
    const response = await axios.post(`${baseURL}/roll`, { code, userAddress });
    return response.data;
  } catch (error) {
    console.error('Error rolling dice:', error);
    return { success: false, message: 'Failed to roll dice' };
  }
}

// Function to freeze dice
export async function freezeDice(code, userAddress, opponentAddress, diceIndex) {
  try {
    const response = await axios.post(`${baseURL}/freeze`, { code, userAddress, opponentAddress, diceIndex });
    return response.data;
  } catch (error) {
    console.error('Error freezing dice:', error);
    return { success: false, message: 'Failed to freeze dice' };
  }
}

// Function to create game
export async function createGame(code, userAddress) {
  try {
    const response = await axios.post(`${baseURL}/create`, { code, userAddress });
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    return { success: false, message: 'Failed to create game' };
  }
}

// Function to join game
export async function joinGame(code, userAddress) {
  try {
    const response = await axios.post(`${baseURL}/join`, { code, userAddress });
    return response.data;
  } catch (error) {
    console.error('Error joining game:', error);
    return { success: false, message: 'Failed to join game' };
  }
}

export async function getGame(code, userAddress) {
    try {
      const response = await axios.post(`${baseURL}/getGame`, { code, userAddress });
      return response.data;
    } catch (error) {
      console.error('Error joining game:', error);
      return { success: false, message: 'Failed to join game' };
    }
  }