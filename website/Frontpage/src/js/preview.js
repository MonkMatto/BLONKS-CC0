const web3 = new Web3("https://eth-mainnet.g.alchemy.com/v2/ntDFj2vzjk0_DT1C2hmgzvbF9VMhzGW7"); //My API Key here is locked to contract and to calling website.
const MAIN_BLONKS_ADDRESS = "0x7f463b874eC264dC7BD8C780f5790b4Fc371F11f";
var tok_Id, addy, svg, png, error, previewMode, BLONKScontract;
var rawPng = false;
let numPat = /[0-9]/;
let hexPat = /^0[xX]{1}[a-fA-F0-9]{40}$/;
BLONKScontract = new web3.eth.Contract(MAIN_BLONKS_ABI, MAIN_BLONKS_ADDRESS);

// function getBLONKScontract() {
//     if (currentAccount == null) {
//         renderMessage('Please connect to MetaMask.');
//         ConnectWallet();
//         return false;
//     } else {
//         if (BLONKScontract == null) {
//             BLONKScontract = new web3.eth.Contract(MAIN_BLONKS_ABI, MAIN_BLONKS_ADDRESS); // UPDATE TO CORRECT NETWORK: RINK / ROPS / MAIN
//             return true;
//         } else {
//             return true;
//         }
//     }
// }

function previewPNG() {
  rawPng = "true";
  previewSVG()
}

async function previewSVG() {
    console.log("Contract Connected");
    svg = '<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 1000 1000" width="1000" height="1000" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient gradientUnits="userSpaceOnUse" cx="500" cy="500" r="490" id="bkStyle"><stop offset=".5" style="stop-color: #ffffff"/><stop offset="1" style="stop-color: rgb(125, 165, 185)"/></radialGradient></defs><rect id="background" width="1000" height="1000" style="fill: url(#bkStyle);"/><rect x="365" y="500" width="270" height="520" style="fill: rgba(130, 90, 70, 1); stroke-width: 10px; stroke: rgb(32, 32, 32);"/><rect x="220" y="215" width="560" height="570" style="fill: rgba(150, 110, 90, 1); stroke-width: 19px; stroke: rgb(42, 42, 42);"/><rect x="353" y="388" width="133" height="120" style="fill: rgba(197, 139, 119, 1); stroke-width: 6px; stroke: rgb(55, 55, 55);"/><rect x="530" y="403" width="118" height="115" style="fill: rgba(197, 139, 119, 1); stroke-width: 6px; stroke: rgb(55, 55, 55);"/><rect x="403" y="436" width="52" height="44" style="fill: rgb(32,32,32); stroke-width: 6px; stroke: rgb(55,55,55);"/><rect x="578" y="424" width="43" height="53" style="fill: rgb(32,32,32); stroke-width: 6px; stroke: rgb(55,55,55);"/><rect x="484" y="499" width="22" height="83" style="fill: rgba(175, 117, 133, 1); stroke-width: 6px; stroke: rgb(55, 55, 55);"/><rect x="158" y="402" width="62" height="142" style="fill: rgba(198, 122, 129, 1); stroke-width: 6px; stroke: rgb(42, 42, 42);"/><rect x="780" y="402" width="62" height="142" style="fill: rgba(198, 122, 129, 1); stroke-width: 6px; stroke: rgb(42, 42, 42);"/><rect x="319" y="316" width="143" height="30" style="fill: rgba(55, 55, 55, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="501" y="349" width="128" height="20" style="fill: rgba(55, 55, 55, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="362" y="606" width="275" height="47" style="fill: rgba(203, 91, 125, 1); stroke-width: 6px; stroke: rgb(55, 55, 55);"/><rect x="190" y="162" width="620" height="127" style="fill: rgba(165, 44, 78, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="179" y="785" width="643" height="83" style="fill: rgba(125, 4, 38, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="179" y="564" width="41" height="231" style="fill: rgba(125, 4, 38, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="780" y="564" width="41" height="231" style="fill: rgba(125, 4, 38, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/></svg>'

    var error = false;
    var previewMode = false;
    var rawTokenId = document.getElementById('tokenId').value;
    var rawAddress = document.getElementById('address').value;
    if (rawTokenId.match(numPat) && rawTokenId >= 0 && rawTokenId < 4444) {
        tok_Id = rawTokenId;
        console.log("Token ID Accepted: " + tok_Id);
    } else {
        console.log("Token ID Not Accepted");
        error = true;
    }
    if (rawAddress != "") {
        if (rawAddress.match(hexPat)) {
            addy = rawAddress;
            console.log("Address Accepted: " + addy);
            previewMode = true;
        } else {
            console.log("Address Not Accepted");
            error = true;
        }
    } 
    if (!error) {
        if (previewMode) {
            console.log("Attempting to previewSVG");
            try {
                svg = await BLONKScontract.methods.previewSVG(tok_Id, addy).call({
                }, function(err, res) {
                if (err) {
                    console.log(err);
                    return
                }
                });
            } catch (errorMessage) {
                error = true;
            }
        } else {
            console.log("Attempting to getSVG");
            try {
                svg = await BLONKScontract.methods.getSVG(tok_Id).call({
                }, function(err, res) {
                if (err) {
                    console.log(err);
                    return
                }
                });
            } catch (errorMessage) {
                error = true;
            }
        }
    } 
    if (error) {
        svg = '<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 1000 1000" width="1000" height="1000" xmlns="http://www.w3.org/2000/svg"></svg>';
        alert("There was an error. Please check your inputs and try again.");
  }
  if (rawPng == "true") {
    rawPng = "";
    console.log(svg);
    console.log("Attemping to convert to PNG");
    svgToPng(svg, (imgData) => {
      const pngImage = document.createElement('img');
      document.getElementById("svgPlaceholder").innerHTML = "";
      document.getElementById("svgPlaceholder").appendChild(pngImage);
      //document.body.appendChild(pngImage);
      pngImage.src = imgData;
    });
    function svgToPng(svg, callback) {
      const url = getSvgUrl(svg);
      svgUrlToPng(url, (imgData) => {
        callback(imgData);
        URL.revokeObjectURL(url);
      });
    }
    function getSvgUrl(svg) {
      return URL.createObjectURL(new Blob([svg], {
        type: 'image/svg+xml'
      }));
    }
    function svgUrlToPng(svgUrl, callback) {
      const svgImage = document.createElement('img');
      document.body.appendChild(svgImage);
      svgImage.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.drawImage(svgImage, 0, 0);
        const imgData = canvas.toDataURL('image/png');
        callback(imgData);
        document.body.removeChild(svgImage);
      };
      svgImage.src = svgUrl;
    }
  } else {
    console.log(svg);
    document.getElementById("svgPlaceholder").innerHTML = svg;
  }
}
