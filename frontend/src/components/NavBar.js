// import React from 'react';
// import { useConnectWallet, useSetChain } from '@web3-onboard/react';

// const NavBar = () => {
//   const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
//   const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

//   return (
//     <nav className="navbar">
//       <button
//         disabled={connecting}
//         onClick={() =>
//           wallet
//             ? connectedChain.id !== "0x186a4"
//               ? setChain({ chainId: 100004 })
//               : disconnect(wallet)
//             : connect()
//         }
//       >
//         {connecting ? 'Connecting' : wallet ? (connectedChain.id !== "0x186a4" ? "Invalid Chain" : 'Disconnect') : 'Connect'}
//       </button>
//     </nav>
//   );
// };

// export default NavBar;
