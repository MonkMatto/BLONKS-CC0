var max = [4444,444,222,1111,111,1031,333,512];
var tok_Id, addy, svg, png, error, gasError;
var currentShifters = max.length;
var shiftState = 0;
var rawPng = false;
let numPat = /[0-9]/;
let hexPat = /^0[xX]{1}[a-fA-F0-9]{40}$/;

function previewPNG() {
  rawPng = "true";
  previewSVG();
}

document.addEventListener("DOMContentLoaded", function(event) {
    _updateUtilization();
    updateSampleSVGs();
});

async function _updateUtilization() {
    try {
        const available = await uriContractAlchemy.methods.getShapeshiftAvailability().call();
        for (let i = 0; i < currentShifters; i++) {
            document.getElementById(`state-${i}-active`).innerHTML = max[i] - available[i];
        }
    } catch (err) {
        console.error("Error fetching shapeshifter:", err);
    }  
}

async function updateSampleSVGs() {
  // Wiping any previous previewed SVG
  document.getElementById("svgPlaceholder").innerHTML = "";
  // Getting random renders
  let BLONKsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(0).call();
  let DarkBLONKsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(1).call();
  let PepeBLONKsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(2).call();
  let BLOOPsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(3).call();
  let AIGBLONK; // needs unique treatment to allow for out of gas calls on the AIG renderer.
  try {
    AIGBLONK = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(4).call();
  } catch (err) {
    console.error("Error fetching AIGBLONK:", err);
    AIGBLONK =
      "<strong><em>Error fetching AIG render - gas limit exceeded.</em> :/</strong>";
  }
  let SkullyBLONKsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(5).call();
  let Cyclessvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(6).call();
  let CONTEXTsvg = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(7).call();


  // AIGBLONK = await uriContractAlchemy.methods.RANDOM_RENDER_SVG(4).call();
  document.getElementById("BLONK-live").innerHTML = BLONKsvg;
  document.getElementById("DarkBLONK-live").innerHTML = DarkBLONKsvg;
  document.getElementById("PepeBLONK-live").innerHTML = PepeBLONKsvg;
  document.getElementById("BLOOP-live").innerHTML = BLOOPsvg;
  document.getElementById("AIGBLONK-live").innerHTML = AIGBLONK;
  document.getElementById("SkullyBLONK-live").innerHTML = SkullyBLONKsvg;
  document.getElementById("Cycles-live").innerHTML = Cyclessvg;
  document.getElementById("CONTEXT-live").innerHTML = CONTEXTsvg;
}

// Uses the user's Web3 instance
async function shapeshift() {
  if (!web3User || !uriContractUser) {
      console.error("User's Web3 or Contract not initialized. Please connect a wallet.");
      return;
  }
  var error = false;
  var rawTokenId = document.getElementById("shifting-tokenId").value;
  var rawShiftState = document.getElementById("shifting-state").value;
  if (rawTokenId.match(numPat) && rawTokenId >= 0 && rawTokenId < 4444) {
      tok_Id = rawTokenId;
      console.log("Token ID Accepted: " + tok_Id);
  } else {
      console.log("Token ID Not Accepted");
      error = true;
  }
  if (rawShiftState.match(numPat) && rawShiftState < currentShifters && rawShiftState >= 0) {
      shiftState = rawShiftState;
      console.log("Shifter State Accepted: " + shiftState);
  } else {
      console.log("Shifter State Not Accepted");
      error = true;
  }
  if (!error) {
          console.log("Attempting to Shapeshift Token");
          try {
              await uriContractUser.methods.SHAPESHIFT(tok_Id, shiftState).send(
                {
                  from: currentAccount
                },
                function (err, res) {
                  if (err) {
                    console.log(err);
                    return;
                  }
                }
              );
          } catch (errorMessage) {
              error = true;
          }
  } 
  if (error) {
      alert("There was an error. Please check your inputs and try again.");
  }
  _updateUtilization();
}

// Uses the Alchemy API web3 instance
async function previewSVG() {
    console.log("Contract Connected");
    svg = '<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient gradientUnits="userSpaceOnUse" cx="500" cy="500" r="490" id="bkStyle"><stop offset=".5" style="stop-color: #ffffff"/><stop offset="1" style="stop-color: rgb(125, 165, 185)"/></radialGradient></defs><rect id="background" width="1000" height="1000" style="fill: url(#bkStyle);"/><rect x="365" y="500" width="270" height="520" style="fill: rgba(130, 90, 70, 1); stroke-width: 10px; stroke: rgb(32, 32, 32);"/><rect x="220" y="215" width="560" height="570" style="fill: rgba(150, 110, 90, 1); stroke-width: 19px; stroke: rgb(42, 42, 42);"/><rect x="353" y="388" width="133" height="120" style="fill: rgba(197, 139, 119, 1); stroke-width: 6px; stroke: rgb(55, 55, 55);"/><rect x="530" y="403" width="118" height="115" style="fill: rgba(197, 139, 119, 1); stroke-width: 6px; stroke: rgb(55, 55, 55);"/><rect x="403" y="436" width="52" height="44" style="fill: rgb(32,32,32); stroke-width: 6px; stroke: rgb(55,55,55);"/><rect x="578" y="424" width="43" height="53" style="fill: rgb(32,32,32); stroke-width: 6px; stroke: rgb(55,55,55);"/><rect x="484" y="499" width="22" height="83" style="fill: rgba(175, 117, 133, 1); stroke-width: 6px; stroke: rgb(55, 55, 55);"/><rect x="158" y="402" width="62" height="142" style="fill: rgba(198, 122, 129, 1); stroke-width: 6px; stroke: rgb(42, 42, 42);"/><rect x="780" y="402" width="62" height="142" style="fill: rgba(198, 122, 129, 1); stroke-width: 6px; stroke: rgb(42, 42, 42);"/><rect x="319" y="316" width="143" height="30" style="fill: rgba(55, 55, 55, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="501" y="349" width="128" height="20" style="fill: rgba(55, 55, 55, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="362" y="606" width="275" height="47" style="fill: rgba(203, 91, 125, 1); stroke-width: 6px; stroke: rgb(55, 55, 55);"/><rect x="190" y="162" width="620" height="127" style="fill: rgba(165, 44, 78, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="179" y="785" width="643" height="83" style="fill: rgba(125, 4, 38, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="179" y="564" width="41" height="231" style="fill: rgba(125, 4, 38, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/><rect x="780" y="564" width="41" height="231" style="fill: rgba(125, 4, 38, 1); stroke-width: 0px; stroke: rgb(0, 0, 0);"/></svg>'
    var error = false;
    var rawTokenId = document.getElementById('tokenId').value;
    var rawAddress = document.getElementById('address').value;
    var rawShiftState = document.getElementById('shift-state').value;
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
        } else {
            console.log("Address Not Accepted");
            error = true;
        }
    } else {
        console.log("Attempting to get current owner");
        try {
            addy = await mainContractAlchemy.methods.ownerOf(tok_Id).call({
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
    if (rawShiftState != "") {
      if (
        rawShiftState.match(numPat) &&
        rawShiftState < currentShifters &&
        rawShiftState >= 0
      ) {
        shiftState = rawShiftState;
        console.log("Shifter State Accepted: " + shiftState);
      } else {
        console.log("Shifter State Not Accepted");
        error = true;
      }
    } else {
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
    }
    if (!error) {
            console.log("Attempting to previewSVG");
            try {
                svg = await uriContractAlchemy.methods.PREVIEW_SHAPESHIFTER_SVG(tok_Id, addy, shiftState).call({
                }, function(err, res) {
                if (err) {
                    console.log(err);
                    return
                }
                });
            } catch (errorMessage) {
                error = true;
                gasError = true;
            }
    } 
    if (error) {
        svg = '<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>';
        if (gasError) {
          alert("The preview failed, likely due to the selected rendering algorithm exceeding the gas limit. Shifting this token to this state may result in it's failure to render on dApps. Please try another token or rendering algorithm.");
        } else { 
          alert("There was an error. Please check your inputs and try again.");
        }
  }

  if (rawPng == "true") {
    rawPng = "";
    console.log(svg);
    console.log("Attemping to convert to PNG");
    svgToPng(svg, (imgData) => {
      const pngImage = document.createElement('img');
      document.getElementById("svgPlaceholder").innerHTML = "";
      document.getElementById("svgPlaceholder").appendChild(pngImage);
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
