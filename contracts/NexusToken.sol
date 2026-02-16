// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Nexus Coin (NXC)
 * @dev Token oficial do Portal NEXUS com economia deflacionária.
 */
contract NexusToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 21000000 * 10**18;
    uint256 public constant TRANSACTION_FEE = 2; // 2% fee

    address public treasury;
    address public operationalRevenue;

    event FeeDistributed(uint256 treasuryAmount, uint256 burnAmount, uint256 revenueAmount);

    constructor(address _treasury, address _operationalRevenue) ERC20("Nexus Coin", "NXC") Ownable(msg.sender) {
        treasury = _treasury;
        operationalRevenue = _operationalRevenue;
        // Mint inicial para a tesouraria do protocolo (ex: 50% de liquidez inicial)
        _mint(msg.sender, 10000000 * 10**18);
    }

    /**
     * @dev Sobrescreve a transferência para aplicar a taxa de 2% do Portal NEXUS
     */
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 fee = (amount * TRANSACTION_FEE) / 100;
        uint256 netAmount = amount - fee;

        _distributeFee(fee);
        return super.transfer(recipient, netAmount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 fee = (amount * TRANSACTION_FEE) / 100;
        uint256 netAmount = amount - fee;

        _distributeFeeFrom(sender, fee);
        return super.transferFrom(sender, recipient, netAmount);
    }

    /**
     * @dev Distribui a taxa: 40% Tesouraria, 30% Queima, 30% Receita
     */
    function _distributeFee(uint256 feeAmount) internal {
        uint256 treasuryAmount = (feeAmount * 40) / 100;
        uint256 burnAmount = (feeAmount * 30) / 100;
        uint256 revenueAmount = feeAmount - treasuryAmount - burnAmount;

        _transfer(msg.sender, treasury, treasuryAmount);
        _transfer(msg.sender, operationalRevenue, revenueAmount);
        _burn(msg.sender, burnAmount);

        emit FeeDistributed(treasuryAmount, burnAmount, revenueAmount);
    }

    function _distributeFeeFrom(address sender, uint256 feeAmount) internal {
        uint256 treasuryAmount = (feeAmount * 40) / 100;
        uint256 burnAmount = (feeAmount * 30) / 100;
        uint256 revenueAmount = feeAmount - treasuryAmount - burnAmount;

        _transfer(sender, treasury, treasuryAmount);
        _transfer(sender, operationalRevenue, revenueAmount);
        _burn(sender, burnAmount);

        emit FeeDistributed(treasuryAmount, burnAmount, revenueAmount);
    }

    /**
     * @dev Permite ao administrador mintar tokens (utilizado na ponte Database -> Blockchain)
     */
    function mintForBridge(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Excede o suprimento maximo");
        _mint(to, amount);
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        treasury = _newTreasury;
    }

    function setRevenueAddress(address _newRevenue) external onlyOwner {
        operationalRevenue = _newRevenue;
    }
}
