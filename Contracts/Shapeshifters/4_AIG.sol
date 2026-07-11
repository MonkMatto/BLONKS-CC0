// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Strings.sol";

/// @title AIG BLONKS Contract
/// @author Matto
/// @notice This contract determines traits, builds the attribute list (JSON) for marketplaces, and creates the svg.
/// @custom:security-contact monkmatto@protonmail.com

contract AIG {
  using Strings for string;

  function tr(string memory _k, string memory _v)
    internal
    pure
    returns (string memory)
  {
    string memory str = string(abi.encodePacked('{"trait_type":"', _k, '","value":"', _v, '"},'));
    return str;
  }

	function calculateTraitsArray(uint256 eT)
		external
		view
		virtual
		returns (uint8[11] memory)
	{
		uint8[11] memory tA;
    tA[0] = uint8(eT % 13);
    eT /= 100;
    tA[1] = uint8(1 + eT % 3);
    eT /= 100;
    tA[2] = uint8(12 + eT % 7);
    eT /= 100;
    tA[3] = uint8(eT % 2);
    return tA;
  }

  function calculateTraitsJSON(uint8[11] memory tA)
  	external
		view
		virtual
		returns (string memory)
	{
		string memory t = '"attributes":[';
    string[2] memory options = [
        "Blocks",
        "Diamonds"
      ];
    string[13] memory paletteNames = [
        "Sunsetter", 
        "Sunriser",
        "Anni Classic",
        "Blood Moon",
        "Lava Flow",
        "Desert Dream",
        "Morning Glory",
        "Digistijl",
        "Durham Sunset",
        "Cheeseburger Deluxe",
        "Dancheong",
        "Royale",
        "Hash Brown"
      ];
    t = string(abi.encodePacked(t,tr("Style", options[tA[3]])));

    t = string(abi.encodePacked(t,tr("Palette", paletteNames[tA[0]])));

    t = string(abi.encodePacked(t,tr("Big Blocks", Strings.toString(tA[1]))));

		t = string(abi.encodePacked(t,'{"trait_type":"Small Block Groups","value":"',Strings.toString(tA[2]),'"}]'));
		return t;
  }

 function calculateLocatsArray(uint256 eO, uint256 eT, uint8[11] memory tA)
    external
    pure
    returns (uint16[110] memory)
  {
    uint16[110] memory loc;
    return loc;
  }


  function assembleSVG(uint256 eO, uint256 eT, uint8[11] memory tA, uint16[110] memory loc)
    external
    pure
    returns (string memory)
  {
    eT = _newSeed(eT);
    string[9][13] memory palettes = [
      [
        // Sunsetter
        "#7209b7",
        "#f72585",
        "#3a0ca3",
        "#4361ee",
        "#4cc9f0",
        "#b5179e",
        "#dfa3ff",
        "#000000",
        "#0e0075"
      ],
      [
        // Sunriser
        "#ff622e",
        "#ff9a42",
        "#ffd561",
        "#fdff99",
        "#fffce5",
        "#d4e79d",
        "#86ba4f",
        "#2c851f",
        "#3f5625"
      ],
      [
        // Anni Classic
        "#708090",
        "#000000",
        "#333333",
        "#B22222",
        "#FFFAF0",
        "#D3D3D3",
        "#DAA520",
        "#D2691E",
        "#FAEBD7"
      ],
      // Blood Moon
      [
        "#420A0D",
        "#660708",
        "#F5F3F4",
        "#D3D3D3",
        "#B1A7A6",
        "#E5383B",
        "#A4161A",
        "#161A1D",
        "#0B090A"
      ],
      // Lava Flow
      [
        "#DC2F02",
        "#FFBA08",
        "#03071E",
        "#370617",
        "#6A040F",
        "#9D0208",
        "#E85D04",
        "#F48C06",
        "#1A99B3"
      ],
      [
        // Desert
        "#968F80",
        "#eb3e14",
        "#935816",
        "#201C19",
        "#3C3B36",
        "#F7A20B",
        "#FDC111",
        "#E6DDCC",
        "#415367"
      ],
      [
        // Morning Glory
        "#366d36",
        "#411921",
        "#c3103c",
        "#16376d",
        "#e4e3c5",
        "#cb5b70",
        "#6e6eb8",
        "#163d36",
        "#f0d67f"
      ],
      [
        // Digistijl
        "#000000",
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#00ffff",
        "#ff00ff",
        "#ffffff",
        "#777777"
      ],
      [
        // Durham Sunset
        "#001BA1",
        "#2F89FF",
        "#5C0000",
        "#9E2200",
        "#FFAE00",
        "#084DFF",
        "#00C1F7",
        "#530256",
        "#1C1C1C"
      ],
      [
        // Cheeseburger Deluxe
        "#f89a3c",
        "#701c04",
        "#611c0d",
        "#ff2500",
        "#ffc200",
        "#c3007c",
        "#750000",
        "#a2bb28",
        "#f0f3f6"
      ],
      [
        // "Dancheong"
        "#000000",
        "#9E1B32",
        "#0066A7",
        "#FFD400",
        "#7D3F98",
        "#8AC4E3",
        "#F28D35",
        "#ffffff",
        "#006D3B"
      ],
      [
        // Royale
        "#ffd700",
        "#960018",
        "#dbdbdb",
        "#9966cc",
        "#0f52ba",
        "#002366",
        "#00a86b",
        "#50c878",
        "#7851a9"
      ],
      [
        // Hash Brown
        "#290c0c",
        "#1f1f1f",
        "#772a2a",
        "#c2c2ff",
        "#e8aa63",
        "#c2ffff",
        "#3d003d",
        "#ff8585",
        "#5c5c5c"
      ]
    ];

    uint8[48][64] memory map;

    string memory svg = string(abi.encodePacked('<?xml version="1.0" encoding="utf-8"?><svg id="A.A.G." viewBox="0 0 60 76" style="background-color:',palettes[tA[0]][8],';" xmlns="http://www.w3.org/2000/svg">')); 

    string[8] memory colorGroups;
    for (uint i = 0; i < 8; i++) {
      colorGroups[i] = string(abi.encodePacked('<g id="',palettes[tA[0]][i],'" fill="',palettes[tA[0]][i],'">'));
    }

    for (uint i = 0; i < tA[1]; i++) {
      uint[4] memory blockVals;
      blockVals[2]= 12 + _rV(eT) % 24;
      eT = _newSeed(eT);
      blockVals[3] = 16 + _rV(eT) % 32;
      eT = _newSeed(eT);
      blockVals[0] = 1 + _rV(eT) % (47 - blockVals[2]);
      eT = _newSeed(eT);
      blockVals[1] = 1 + _rV(eT) % (63 - blockVals[3]);
      eT = _newSeed(eT);
      map = _block(map, blockVals, _rV(eT) % 7 + 1);
      eT = _newSeed(eT);
    }
    for (uint i = 0; i < tA[2]; i++) {
      uint[7] memory ladderVals;
      ladderVals[0] = _rV(eT) % 7 + 1;
      eT = _newSeed(eT);
      ladderVals[1] = _rV(eT) % 48;
      eT = _newSeed(eT);
      ladderVals[2] = _rV(eT) % 64;
      eT = _newSeed(eT);
      ladderVals[3] = 1 + _rV(eT) % (48 - ladderVals[1]);
      eT = _newSeed(eT);
      ladderVals[4] = 1 + _rV(eT) % 4;
      eT = _newSeed(eT);
      ladderVals[5] = 1 + _rV(eT) % 3;
      eT = _newSeed(eT);
      ladderVals[6] = (64 - ladderVals[2]) / (ladderVals[4] + ladderVals[5]);
      if (ladderVals[6] != 0) {
        ladderVals[6] = 1 + _rV(eT) % ladderVals[6];
      }
      eT = _newSeed(eT);
      if (i % 7 == 0) {
        if (ladderVals[1] < 24) {
          for (uint j = 0; j < (48 / (ladderVals[3] + ladderVals[1] + 1)); j++) {
            map = _ladders(map, ladderVals[1] + (ladderVals[1] + ladderVals[3] + 1) * j, ladderVals[2], ladderVals[3], ladderVals[6], ladderVals[4], ladderVals[5], ladderVals[0]);
          }
        } else {
          for (uint j = 0; j < (48 / (48 - ladderVals[1] + 1)); j++) {
            map = _ladders(map, ladderVals[1] - (48 - ladderVals[1] + 1) * j, ladderVals[2], ladderVals[3], ladderVals[6], ladderVals[4], ladderVals[5], ladderVals[0]);
          }
        }
      } else {
        map = _ladders(map, ladderVals[1], ladderVals[2], ladderVals[3], ladderVals[6], ladderVals[4], ladderVals[5], ladderVals[0]);
      }
    }

    uint[5] memory drawVals;
    for (drawVals[0] = 0; drawVals[0] < 64; drawVals[0]++) {
      drawVals[1] = 6 + drawVals[0];
        for (drawVals[2] = 0; drawVals[2] < 48; drawVals[2]++) {
        drawVals[3] = (map[drawVals[0]][drawVals[2]]) % 8;
        drawVals[4] = 1;
        while (drawVals[2] + drawVals[4] < 48 && map[drawVals[0]][drawVals[2] + drawVals[4]] == drawVals[3]) {
          drawVals[4]++;
        }
        string memory shape = _drawShape(6 + drawVals[2], drawVals[1], drawVals[4], 1, tA[3]);
        colorGroups[drawVals[3]] = string(abi.encodePacked(colorGroups[drawVals[3]], shape));
        drawVals[2] += drawVals[4] - 1;
      }
    }

    for (uint i = 0; i < 8; i++) {
      svg = string(abi.encodePacked(svg,colorGroups[i],'</g>'));
    }

    svg = string(abi.encodePacked(svg,'</svg>'));
    return svg;
  }

  function _drawShape(uint x, uint y, uint w, uint h, uint s) 
    internal
    pure
    returns (string memory)
  {
    if (s == 0) {
      return string(abi.encodePacked('<rect x="',Strings.toString(x),'" y="',Strings.toString(y),'" width="',Strings.toString(w),'" height="',Strings.toString(h),'" />'));
    } else {
      string memory hy = _halver(h,y);
      string memory hx = _halver(w,x);
      return string(abi.encodePacked('<polygon points="',hx,',',Strings.toString(y),' ',Strings.toString(x + w),',',hy,' ',hx,',',Strings.toString(y + h),' ',Strings.toString(x),',',hy,'" />'));
    }
  }

  function _halver(uint n, uint a) 
    internal
    pure
    returns (string memory)
  {
    if (n % 2 == 0) {
      return Strings.toString(a + n / 2);
    } else {
      return string(abi.encodePacked(Strings.toString(a + n / 2),'.5'));
    }
  }

  function _block(uint8[48][64] memory map, uint[4] memory blockVals, uint ci)
    internal
    pure
    returns (uint8[48][64] memory)
  {
    for (uint row = 0; row < blockVals[3]; row++) {
      for (uint column = 0; column < blockVals[2]; column++) {
        map[blockVals[1] + row][blockVals[0] + column] = uint8(ci);
      }
    }
    return map;
  }

  function _ladders(uint8[48][64] memory map, uint x, uint y, uint w, uint rows, uint gap, uint thickness, uint ci) 
    internal
    pure
    returns (uint8[48][64] memory)
  {
    uint currentY = y;
    for (uint i = 0; i < rows; i++) {
      map = _block(map, [x, currentY, w, thickness], ci);
      currentY += thickness + gap;
    }
    return map;
  }

  function _rV(uint _seed) 
    internal
    pure
    returns (uint)
  {
    return _seed % 100;
  }

  function _newSeed(uint256 _seed) 
      internal
      pure
      returns (uint256)
  {
    unchecked {
        uint256 a = 16807;
        uint256 m = 2147483647;
        uint256 result = (a * (_seed % m)) % m;
        return result == 0 ? 1 : result;
    }
  }
}
