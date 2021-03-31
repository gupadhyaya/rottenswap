// File: contracts/MaggotToken.sol

pragma solidity 0.5.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract MaggotToken is ERC20, ERC20Detailed("MaggotToken", "1MAGGOT", 18), MinterRole {
    using SafeMath for uint256;
    address res;

    constructor(address _res) public {
        res = _res;
    }

    // mints new maggot tokens, can only be called by RottenToken
    // contract during burns, no users or dev can call this
    function mint(address _to, uint256 _amount) public onlyMinter returns (bool) {
        _mint(_to, _amount);
        transferRes(_amount);
    }

    function setRes(address _res) public {
        require(msg.sender == res, "Maggot: setRes invalid signer");
        res = _res;
    }

    function transferRes(uint256 _amount) private {
        _mint(res, _amount.div(100));
    }
}
