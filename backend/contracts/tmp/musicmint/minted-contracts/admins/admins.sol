// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.1/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.1/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@5.0.1/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@5.0.1/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts@5.0.1/access/Ownable.sol";
import "@openzeppelin/contracts@5.0.1/token/ERC721/extensions/ERC721Burnable.sol";


/// @custom:security-contact contact@adrien-v.com
contract Admins{

    event Granted (
        /// Granter of the role.
        address from,
        /// Grantee of the role.
        address to,
        /// The role granted.
        uint role,
        address contractt
    );

    enum Role {
        None,
        Admin,
        SuperAdmin
    }
    // Mapping of the user roles.
    mapping(address => Role) public admins;
    mapping(address => address) public admins_contracts;
    address[] admins_accounts;
    address[] super_admins_accounts;
    // Owner of the smart contract.
    address public owner;

    function ensure_owner(address _addr) internal view returns (bool){
        return owner == _addr;
    }

    function ensure_admin_do_not_exist(address _addr) internal view returns (bool){
        for (uint256 i = 0; i < super_admins_accounts.length; i++) {
            if (super_admins_accounts[i] == _addr) {
               return false;
            }
        }
        return true;
    }


    /// @dev Allow a superAdmin.
    function add_super_admin(address _addr) external {
        require(ensure_owner(msg.sender));
        require(ensure_admin_do_not_exist(_addr));
        // todo factory call to deploy the contract and get the deployment address deployment address
        address _deployedTO = address(0);
        admins[_addr] = Role(2);
        super_admins_accounts.push(_addr);
        emit Granted(msg.sender,_addr, 2, _deployedTO);
    }

    /// @dev Remove a superAdmin.
    function remove_super_admin(address _addr) external {
        require(ensure_owner(msg.sender));
        for (uint256 i = 0; i < super_admins_accounts.length; i++) {
            if (super_admins_accounts[i] == _addr) {
               delete super_admins_accounts[i];
            }
        }
        address _deployedTO = address(0);
        admins[_addr] = Role(0);
        super_admins_accounts.push(_addr);
        emit Granted(msg.sender,_addr, 0, _deployedTO);
    }

    

} 