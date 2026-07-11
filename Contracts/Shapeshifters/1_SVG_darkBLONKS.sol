// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title darkBLONKS SVG Contract v1.1
/// @author Matto
/// @notice This contract builds the SVG text.
/// @custom:security-contact monkmatto@protonmail.com

interface iBLONKSsvg {
    function assembleSVG(
        uint256 _ownerEntropy,
        uint256 _tokenEntropy,
        uint8[11] memory _traitsArray,
        uint16[110] memory _locatsArray
    ) external view returns (string memory);
}

contract darkBLONKSsvg is Ownable {
    using Strings for string;
    address private OGcontract = 0x80Fd7B94898B77EC49a9A70C0741cD672385c856; // Mainnet

    function updateOGcontract(address _newOGcontract) external onlyOwner {
        OGcontract = _newOGcontract;
    }

    function rA(
        uint16 _x,
        uint16 _y,
        uint16 _w,
        uint16 _h,
        uint16 _r,
        uint16 _g,
        uint16 _b,
        uint16 _sw,
        uint16 _sc
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<rect x="',
                    Strings.toString(_x),
                    '" y="',
                    Strings.toString(_y),
                    '" width="',
                    Strings.toString(_w),
                    '" height="',
                    Strings.toString(_h),
                    '" style="fill: rgb(',
                    Strings.toString(_r),
                    ", ",
                    Strings.toString(_g),
                    ", ",
                    Strings.toString(_b),
                    "); stroke-width: ",
                    Strings.toString(_sw),
                    "px; stroke: rgb(",
                    Strings.toString(_sc),
                    ", ",
                    Strings.toString(_sc),
                    ", ",
                    Strings.toString(_sc),
                    ');"/>'
                )
            );
    }

    function rS(
        uint16 _x,
        uint16 _y,
        uint16 _w,
        uint16 _h,
        string memory _style
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<rect x="',
                    Strings.toString(_x),
                    '" y="',
                    Strings.toString(_y),
                    '" width="',
                    Strings.toString(_w),
                    '" height="',
                    Strings.toString(_h),
                    '" style="fill: rgb',
                    _style
                )
            );
    }


    function _substring(string memory str) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        require(strBytes.length > 38, "String is too short");

        bytes memory result = new bytes(strBytes.length - 38);

        for (uint i = 38; i < strBytes.length; i++) {
            result[i - 38] = strBytes[i];
        }

        return string(result);
    }


    function assembleSVG(
        uint256 eO,
        uint256 eT,
        uint8[11] memory tA,
        uint16[110] memory loc
    ) external view returns (string memory) {
        // Variables
        string memory OGsvg = iBLONKSsvg(OGcontract).assembleSVG(
            eO,
            eT,
            tA,
            loc
        );
        OGsvg = _substring(OGsvg);
        string memory b = string(
            abi.encodePacked(
                '<?xml version="1.0" encoding="utf-8"?>',
                '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">',
                OGsvg,
                '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">',
                rS(0, 0, 1000, 1000, '(0,0,0); fill-opacity: 0.7;"/>')
            )
        );
        string memory s;
        // Ear rings
        loc[49] = loc[32] + loc[30] - 35;
        s = '(242,242,255); stroke-width: 2px; stroke: rgb(233,233,242);"/>';
        if (tA[7] == 4) {
            s = '(22,22,22); fill-opacity: 0.5; stroke-width: 8px; stroke: rgb(12,12,12);"/>';
            loc[48] = 20;
        }
        if (tA[7] == 1 || tA[7] == 3 || tA[7] == 4) {
            b = string(
                abi.encodePacked(
                    b,
                    rS(
                        loc[28] + (loc[31] - loc[48]) / 2,
                        loc[49],
                        loc[48],
                        loc[48],
                        s
                    )
                )
            );
        }
        if (tA[7] == 2 || tA[7] == 3 || tA[7] == 4) {
            b = string(
                abi.encodePacked(
                    b,
                    rS(
                        loc[29] + (loc[31] - loc[48]) / 2,
                        loc[49],
                        loc[48],
                        loc[48],
                        s
                    )
                )
            );
        }
        loc[49] = loc[30] + 20;
        s = '(252,214,18);"/>';
        if (tA[8] == 1 || tA[8] == 3) {
            b = string(
                abi.encodePacked(b, rS(loc[28] - 15, loc[49], 30, 15, s))
            );
        }
        if (tA[8] == 2 || tA[8] == 3) {
            b = string(
                abi.encodePacked(
                    b,
                    rS(loc[29] + loc[31] - 15, loc[49], 30, 15, s)
                )
            );
        }
        // Extra Detail
        if (tA[3] == 1) {
            s = '(50,50,255);"/>';
        } else if (tA[3] == 2) {
            s = '(222,22,22);"/>';
        } else if (tA[3] == 3) {
            s = '(150,220,255);"/>';
        } else if (tA[3] == 4) {
            s = '(124,124,124); fill-opacity: 0.8;"/>';
        }
        if (tA[3] > 0) {
            b = string(
                abi.encodePacked(b, rS(loc[54], loc[55], loc[56], loc[57], s))
            );
            b = string(
                abi.encodePacked(b, rS(loc[58], loc[59], loc[60], loc[61], s))
            );
        }
        // Pupils
        if (tA[1] == 1) {
            s = '(220,52,52); stroke-width: 6px; stroke: rgb(210,42,42);"/>';
        } else if (tA[1] == 2) {
            s = '(47,201,20); stroke-width: 6px; stroke: rgb(70,219,44);"/>';
        } else {
            if (tA[4] == 1) {
                s = '(67, 191, 240); stroke-width: 6px; stroke: rgb(77, 201, 250);"/>';
            } else if (tA[4] == 2) {
                s = '(243,104,203); stroke-width: 6px; stroke: rgb(255,116,225);"/>';
            } else if (tA[4] == 3) {
                s = '(22,122,255); stroke-width: 8px; stroke: rgb(255,22,22);"/>';
            } else if (tA[4] == 4) {
                s = '(252,214,18); stroke-width: 6px; stroke: rgb(242,204,8);"/>';
            } else {
                s = '(212,212,212); stroke-width: 6px; stroke: rgb(222,222,222);"/>';
            }
        }
        b = string(
            abi.encodePacked(b, rS(loc[16], loc[17], loc[18], loc[19], s))
        );
        b = string(
            abi.encodePacked(b, rS(loc[20], loc[21], loc[22], loc[23], s))
        );

        if (tA[6] > 0) {
            b = string(
                abi.encodePacked(
                    b,
                    rA(loc[87], loc[88], loc[89], loc[90], 252, 214, 18, 0, 0)
                )
            );
        }
        if (tA[6] == 2) {
            b = string(
                abi.encodePacked(
                    b,
                    rA(loc[87], loc[91], loc[89], loc[92], 0, 120, 90, 0, 0)
                )
            );
        }
        // Other
        if (tA[9] == 3) {
            b = string(
                abi.encodePacked(
                    b,
                    rS(loc[98], loc[99], loc[100], loc[101], '(252,214,18);"/>')
                )
            );
        }
        b = string(abi.encodePacked(b, "</svg></svg>"));
        return b;
    }
}
