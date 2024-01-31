// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract TokenAirdrop {
    address public owner;
    IERC20 public token;
    mapping(address => uint256) public droppedAmounts;

    event Airdrop(address indexed recipient, uint256 amount);
    event AirdropQuantityUpdated(uint256 newQuantity);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }

    function setToken(address _token) external onlyOwner {
        token = IERC20(_token);
    }

    function setAirdropQuantity(uint256 _quantity) external onlyOwner {
        require(_quantity > 0, "Quantity must be greater than zero");
        emit AirdropQuantityUpdated(_quantity);
    }

    function airdrop(address[] calldata _recipients, uint256[] calldata _amounts) external onlyOwner {
        require(_recipients.length == _amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "Invalid recipient address");
            require(_amounts[i] > 0, "Invalid amount");

            uint256 amountToSend = _amounts[i];
            require(token.transfer(_recipients[i], amountToSend), "Token transfer failed");

            droppedAmounts[_recipients[i]] += amountToSend;
            emit Airdrop(_recipients[i], amountToSend);
        }
    }
}