const web3 = new Web3("https://eth-mainnet.alchemyapi.io/v2/ntDFj2vzjk0_DT1C2hmgzvbF9VMhzGW7"); //My API Key here is locked to contract and to calling website.
const MAIN_BLONKS_ADDRESS = "0x7f463b874eC264dC7BD8C780f5790b4Fc371F11f";
var tok_Id, addy, size, svg, png, error, fixedSize, previewMode, BLONKScontract;
let numPat = /[0-9]/;
let hexPat = /^0[xX]{1}[a-fA-F0-9]{40}$/;
BLONKScontract = new web3.eth.Contract(MAIN_BLONKS_ABI, MAIN_BLONKS_ADDRESS);

var url_string = "https://render.blonks.xyz/?id=0&png=true";
//var url_string = window.location.href;
var url = new URL(url_string);
var rawTokenId = url.searchParams.get("id");
var rawAddress = url.searchParams.get("address");
var rawPng = url.searchParams.get("png");
var rawSize = url.searchParams.get("size");
_preview()

async function _preview() {
  var error = false;
  var previewMode = false;
  if (rawTokenId.match(numPat) && rawTokenId >= 0 && rawTokenId < 4444) {
      tok_Id = rawTokenId;
      console.log("Token ID Accepted: " + tok_Id);
  } else {
      console.log("Token ID Not Accepted");
      error = true;
  }
  if (rawSize != null && rawSize.match(numPat) && rawSize >=10 && rawSize < 10000) {
      size = rawSize;
      console.log("Size Accepted: " + size);
      fixedSize = true;
  }
  if (rawAddress != null) {
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
      console.log("There was an error. Please check your URL query and try again.");
  }
  if (fixedSize) {
    let index = svg.search("xmlns");
    svg = "".concat(svg.slice(0, index), 'width="', size, '" ', 'height="', size, '" ', svg.slice(index));
  }
  if (rawPng == "true") {
    svgToPng(svg, (imgData) => {
      const pngImage = document.createElement('img');
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