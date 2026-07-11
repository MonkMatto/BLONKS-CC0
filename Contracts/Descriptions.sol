// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title BLONKS Dynamic Description Contract v3.0.0
/// @author Matto AKA MonkMatto
/// @notice This contract creates dynamic token descriptions for BLONKS.
/// @dev For flexibility, the descriptions are stored in an array of strings that are assembled with dynamic data.
/// An external contract is added for additional flexibility.
/// @custom:experimental This is an experimental contract.
/// @custom:security-contact monkmatto@protonmail.com

interface iEE {
    function assembleBasicData(
        address _account
    ) external view returns (string[] memory);

    function isComposable(address _account) external view returns (bool);
}

contract DynamicDescriptions is Ownable {
    using Strings for string;

    address public EEcontract;
    bool public EEcontractActive;

    string private EElinkBase;
    string[] private descText;

    function setDescriptionText(string[] memory _text) external onlyOwner {
        for (uint256 i = 0; i < _text.length; i++) {
            descText.push(_text[i]);
        }
    }

    function getDescriptionText() external view returns (string[] memory) {
        return descText;
    }

    function setEEcontract(address _EEcontract) external onlyOwner {
        EEcontract = _EEcontract;
    }

    function setEElinkBase(string memory _EElinkBase) external onlyOwner {
        EElinkBase = _EElinkBase;
    }

    function toggleEEcontractActive() external onlyOwner {
        EEcontractActive = !EEcontractActive;
    }

    function updateDescriptionTextIndex(
        uint256 _index,
        string memory _text
    ) external onlyOwner {
        descText[_index] = _text;
    }

    function buildDynamicDescription(
        address _ownerAddy,
        uint256 _shapeshiftCount,
        string memory _collectionDescription,
        string memory _shifterName,
        uint256 _shifterActive,
        uint256 _shifterMax
    ) external view returns (string memory) {
        string memory shapeshiftDetail = _shapeshiftCount > 0
            ? string(
                abi.encodePacked(descText[9], Strings.toString(_shapeshiftCount), descText[10])
            )
            : "";
        string memory dynamicText = EEcontractActive && iEE(EEcontract).isComposable(_ownerAddy)
            ? _incorporateEE(_ownerAddy)
            : descText[0];
        dynamicText = string(
            abi.encodePacked(
                dynamicText,
                descText[11],
                descText[12],
                _shifterName
            )
        );
        dynamicText = string(
            abi.encodePacked(
                dynamicText,
                shapeshiftDetail,
                descText[13],
                Strings.toHexString(uint160(_ownerAddy), 20),
                descText[14]
            )
        );
        dynamicText = string(
            abi.encodePacked(
                dynamicText,
                _shifterName,
                descText[15],
                Strings.toString(_shifterActive),
                descText[16],
                Strings.toString(_shifterMax),
                descText[8]
            )
        );
        dynamicText = string(
            abi.encodePacked(
                dynamicText,
                descText[17],
                _collectionDescription,
                descText[18]
            )
        );
        return dynamicText;
    }

    function _incorporateEE(
        address _ownerAddy
    ) internal view returns (string memory) {
        string[] memory EEbasicData = iEE(EEcontract).assembleBasicData(
            _ownerAddy
        );
        string memory EEdynamicText;
        if (
            bytes(EEbasicData[0]).length +
                bytes(EEbasicData[1]).length +
                bytes(EEbasicData[2]).length >
            0
        ) {
            EEdynamicText = descText[1];
        }
        if (bytes(EEbasicData[0]).length > 0) {
            EEdynamicText = string(
                abi.encodePacked(EEdynamicText, descText[2], EEbasicData[0])
            );
        }
        if (bytes(EEbasicData[1]).length > 0) {
            EEdynamicText = string(
                abi.encodePacked(EEdynamicText, descText[3], EEbasicData[1])
            );
        }
        uint256 priorityLink = uint256(uint8(bytes(EEbasicData[5])[0])) - 48;
        if (bytes(EEbasicData[priorityLink + 2]).length > 0) {
          EEdynamicText = string(abi.encodePacked(EEdynamicText, descText[priorityLink + 4], EEbasicData[priorityLink + 2]));
        }
        EEdynamicText = string(
            abi.encodePacked(
                EEdynamicText,
                descText[7],
                EElinkBase,
                Strings.toHexString(uint160(_ownerAddy), 20),
                descText[8]
            )
        );
        return EEdynamicText;
    }
}
