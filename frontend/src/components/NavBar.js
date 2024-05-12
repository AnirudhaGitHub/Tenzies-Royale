import React from 'react';
// import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import {ethers} from 'ethers'

const rollappx = {
    chainId: 100004,
    name: 'Rollapp X',
    currency: 'RAX',
    rpcUrl: 'https://json-rpc.rolxtwo.evm.ra.blumbus.noisnemyd.xyz'
  };
  

const NavBar = () => {
    const [connected, setConnected] = React.useState(false);

    React.useEffect(() => {
        const checkConnection = async () => {
          if (window.ethereum) {
            try {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const network = await provider.getNetwork();
              setConnected(network.chainId == rollappx.chainId);
            } catch (error) {
              console.error('Error checking connection:', error);
              setConnected(false);
            }
          } else {
            setConnected(false);
          }
        };
      
        checkConnection(); // Initial check
      
        const intervalId = setInterval(checkConnection, 3000); // Call checkConnection every 3 seconds
      
        return () => clearInterval(intervalId); // Cleanup function to clear the interval
      }, []);
  
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
  
          if (network.chainId === rollappx.chainId) {
            setConnected(true);
          } else {
            // Add network if not present in wallet
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${rollappx.chainId.toString(16)}`,
                chainName: rollappx.name,
                nativeCurrency: {
                  name: rollappx.currency,
                  symbol: rollappx.currency,
                  decimals: 18,
                },
                rpcUrls: [rollappx.rpcUrl],
              }],
            });
          }
        } catch (error) {
          console.error('Error connecting wallet:', error);
        }
      } else {
      }
    };
    
    return(

            <button className={`connect-button ${connected ? 'connected' : ''}`} onClick={connectWallet}
                style={{ 
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    color: 'white',
                    padding: '10px 24px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    margin: '4px 2px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s'
                }}
            >
                {connected ? 'Connected' : 'Connect Wallet'}
            </button>
    )

};

export default NavBar;
