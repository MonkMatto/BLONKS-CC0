// Matto 2022
// Basic code to connect to a web3 instance, used with permission by Sterling Crispin - NotAudited.xyz
// Code legally borrowed from https://docs.metamask.io/guide/ethereum-provider.html
// Using ISC License software https://github.com/MetaMask/detect-provider
// Using MIT License software https://github.com/MetaMask/metamask-docs/blob/main/docs/snippets/handleProvider.js


/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

// note: handling import via unpkg in the parent page
// import detectEthereumProvider from '@metamask/detect-provider';

async function getProvider(){
    console.log("web3 handshake : looking for provider");
    // this returns the provider, or null if it wasn't detected
    const provider = await detectEthereumProvider();
    if (provider) {
        startApp(provider); // Initialize your app
      } else {
        console.log('web3 handshake : Please install MetaMask!');
    }
}
var web3;
getProvider();

function renderMessage(message) {
    var messageEl = document.querySelector('.message')
    messageEl.innerHTML = message
}


function startApp(provider) {
  // If the provider returned by detectEthereumProvider is not the same as
  // window.ethereum, something is overwriting it, perhaps another wallet.
  if (provider !== window.ethereum) {
    //renderMessage('Error: Do you have multiple wallets installed?');
    console.error('web3 handshake : Do you have multiple wallets installed?');
  }
  web3 = new Web3(provider);
  console.log("web3 handshake : success on provider");
  //renderMessage('Success Start App!');
  // Access the decentralized web!
}

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

ethereum.on('chainChanged', handleChainChanged);

async function handleChainChanged() {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
}

/***********************************************************/
/* Handle user accounts and accountsChanged (per EIP-1193) */
/***********************************************************/

let currentAccount = null;
ethereum
  .request({ method: 'eth_accounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
    // Some unexpected error.
    // For backwards compatibility reasons, if no accounts are available,
    // eth_accounts will return an empty array.
    renderMessage('Error:', err);
    console.error(err);
  });

// Note that this event is emitted on page load.
// If the array of accounts is non-empty, you're already
// connected.
ethereum.on('accountsChanged', handleAccountsChanged);

// For now, 'eth_accounts' will continue to always return an array
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('Please connect to MetaMask.');
    renderMessage('Please connect to MetaMask.');
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    console.log("web3 handshake : account connected ", currentAccount)
    renderMessage('Account connected ', currentAccount);
    // Do any other work!
  }
}


/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

// You should only attempt to request the user's accounts in response to user
// interaction, such as a button click.
// Otherwise, you popup-spam the user like it's 1999.
// If you fail to retrieve the user's account(s), you should encourage the user
// to initiate the attempt.
// document.getElementById('connectButton', connect);

// While you are awaiting the call to eth_requestAccounts, you should disable
// any buttons the user can click to initiate the request.
// MetaMask will reject any additional requests while the first is still
// pending.
function ConnectWallet() {
  console.log("web3 handshake : ConnectWallet()")
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
        renderMessage('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
}
