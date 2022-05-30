// Matto 2022 - used with permission from Sterling Crispin
// https://rinkeby.etherscan.io/address/0x52bD7413fC9f113B6565320FEbb3a5a528Fc7d5d
// https://ropsten.etherscan.io/address/
// https://etherscan.io/address/0x7f463b874eC264dC7BD8C780f5790b4Fc371F11f

const MAIN_BLONKS_ADDRESS = "0x7f463b874eC264dC7BD8C780f5790b4Fc371F11f"; // MAINNET
const ROPS_BLONKS_ADDRESS; // ROPSTEN
const RINK_BLONKS_ADDRESS = "0x52bD7413fC9f113B6565320FEbb3a5a528Fc7d5d"; // RINKEBY
var BLONKScontract;

function mintBLONKbutton() {
  if (getBLONKScontract()) {
    _mintBLONK();
  }
}

function getBLONKScontract() {
    if (currentAccount == null) {
        renderMessage('Please connect to MetaMask.');
        ConnectWallet();
        return false;
    } else {
        if (BLONKScontract == null) {
            BLONKScontract = new web3.eth.Contract(MAIN_BLONKS_ABI, MAIN_BLONKS_ADDRESS); // UPDATE TO CORRECT NETWORK: RINK / ROPS / MAIN
            return true;
        } else {
            return true;
        }
    }
}

async function _mintBLONK() {
    console.log("mintBLONK button");
    var mintPrice = web3.utils.toWei(String('0.042'), 'ether');
    try {
        console.log("mintBLONK attempt");
        BLONKScontract.methods.publicMintThatBlonk().send({
            from: currentAccount,
            value: mintPrice
        }, function(err, res) {
            if (err) {
                console.log(err);
                renderMessage("Error: " + err.message);
                return
            }
            console.log(res);
            renderMessage('Transaction submitted <a href="https://etherscan.io/tx/' + res + '" target="_blank">view on etherscan</a>');
        })
    } catch (error) {
        console.log(error);
        renderMessage("Error: " + error.message);
    }
}