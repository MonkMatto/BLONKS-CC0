const web3 = new Web3("https://eth-mainnet.g.alchemy.com/v2/ntDFj2vzjk0_DT1C2hmgzvbF9VMhzGW7"); // Production API link locked to domain and contracts. :)

const MAIN_ADDRESS = "0x7f463b874eC264dC7BD8C780f5790b4Fc371F11f";
const URI_ADDRESS = "0x5bB2333Ee8C9818D4bd898a17f597Ec6F5710Fd6";

const mainContractAlchemy = new web3.eth.Contract(MAIN_ABI, MAIN_ADDRESS);
const uriContractAlchemy = new web3.eth.Contract(URI_ABI, URI_ADDRESS);

var tok_Id, addy, svg, png, error, fixedSize, width, height, size;
var randomized = false;
var shiftState = null;
var rawPng = false;
let numPat = /[0-9]/;
let hexPat = /^0[xX]{1}[a-fA-F0-9]{40}$/;

//var url_string = "https://render.blonks.xyz/?id=0&address=0x52A21501EA522057537F28ae9F7E9A935D56Bc19&shapeshift=2&png=true";
var url_string = window.location.href;
var url = new URL(url_string);
var rawTokenId = url.searchParams.get("id");
var rawAddress = url.searchParams.get("address");
var rawShiftState = url.searchParams.get("shapeshift");
var rawPng = url.searchParams.get("png");
var rawSize = url.searchParams.get("size");
var rawHeight = url.searchParams.get("height");
var rawWidth = url.searchParams.get("width");

if (
  rawShiftState != null &&
  rawShiftState.match(numPat) &&
  rawShiftState < 5 &&
  rawShiftState >= 0
) {
  shiftState = rawShiftState;
  console.log("Shifter State Accepted: " + shiftState);
} 

if (rawTokenId == null) {
  randomiseSVG();
  randomized = true;
} 
previewSVG();

function randomiseSVG() {
  tok_Id = Math.floor(Math.random() * 4444);
  console.log("No URL token ID detected, using random token ID: " + tok_Id);
  addy = "0x";
  var chars = "0123456789abcdef";
  for (var i = 0; i < 40; i++) {
    addy += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  console.log("Random Address: " + addy);
  if (shiftState == null) {
    shiftState = Math.floor(Math.random() * 4);
    console.log("Random Shifter State: " + shiftState);
  }
}

async function previewSVG() {
  var error = false;
  if (
    rawSize != null &&
    rawSize.match(numPat) &&
    rawSize >= 10 &&
    rawSize < 10000
  ) {
    console.log("Size Accepted: " + rawSize);
    width = rawSize;
    height = rawSize;
    fixedSize = true;
  } else if (
    rawWidth != null &&
    rawWidth.match(numPat) &&
    rawWidth >= 10 &&
    rawWidth < 10000 &&
    rawHeight != null &&
    rawHeight.match(numPat) &&
    rawHeight >= 10 &&
    rawHeight < 10000
  ) {
    width = rawWidth;
    height = rawHeight;
    console.log("Width Accepted: " + width);
    console.log("Height Accepted: " + height);
    fixedSize = true;
  }

  if (randomized == false) {
    if (rawTokenId != null && rawTokenId.match(numPat) && rawTokenId >= 0 && rawTokenId < 4444) {
      tok_Id = rawTokenId;
      console.log("Token ID Accepted: " + tok_Id);
    } else {
      error = true;
      console.log("Token ID Not Accepted");
    }
    if (rawAddress != null) {
      if (rawAddress.match(hexPat)) {
        addy = rawAddress;
        console.log("Address Accepted: " + addy);
      } else {
        console.log("Address Not Accepted");
        error = true;
      }
    } else {
      console.log("Attempting to get current owner");
      try {
        addy = await mainContractAlchemy.methods
          .ownerOf(tok_Id)
          .call({}, function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          });
      } catch (errorMessage) {
        error = true;
      }
    }
    if (shiftState == null) {
      console.log(shiftState);
      console.log("Attempting to get current shift state");
      try {
        shiftState = await uriContractAlchemy.methods
          .shifterStateMap(tok_Id)
          .call({}, function (err, res) {
            if (err) {
              console.log(err);
              return;
            }
          });
      } catch (errorMessage) {
        error = true;
      }
    } else {
      if (
        rawShiftState.match(numPat) &&
        rawShiftState < 6 &&
        rawShiftState >= 0
      ) {
        shiftState = rawShiftState;
        console.log("Shifter State Accepted: " + shiftState);
      } else {
        console.log("Shifter State Not Accepted");
        error = true;
      }
    }
  }
  if (!error) {
    console.log("Attempting to previewSVG");
    try {
      svg = await uriContractAlchemy.methods
        .PREVIEW_SHAPESHIFTER_SVG(tok_Id, addy, shiftState)
        .call({}, function (err, res) {
          if (err) {
            if (shiftState > 3) {
              alert("The algorithm exceeded the gas limit. Please try again with a different token ID or shapeshift state.");
            }
            console.log(err);
            return;
          }
        });
    } catch (errorMessage) {
      error = true;
    }
  }
  if (error) {
    svg =
      '<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 1000 1000" width="1000" height="1000" xmlns="http://www.w3.org/2000/svg"></svg>';
    console.log(
      "There was an error. Please check your URL query and try again."
    );
  }
  if (fixedSize) {
    let index = svg.search("xmlns");
    svg = "".concat(
      svg.slice(0, index),
      'width="',
      width,
      '" ',
      'height="',
      height,
      '" ',
      svg.slice(index)
    );
  }
  if (rawPng == "true") {
    svgToPng(svg, (imgData) => {
      const pngImage = document.createElement("img");
      document.body.appendChild(pngImage);
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
      return URL.createObjectURL(
        new Blob([svg], {
          type: "image/svg+xml",
        })
      );
    }
    function svgUrlToPng(svgUrl, callback) {
      const svgImage = document.createElement("img");
      document.body.appendChild(svgImage);
      svgImage.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        const canvasCtx = canvas.getContext("2d");
        canvasCtx.drawImage(svgImage, 0, 0);
        const imgData = canvas.toDataURL("image/png");
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
