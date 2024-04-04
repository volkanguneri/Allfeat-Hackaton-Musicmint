// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol"; 
/// @custom:security-contact contact@adrien-v.com
contract Admins is Ownable{

    event Granted (
        /// Granter of the role.
        address from,
        /// Grantee of the role.
        address to,
        /// The role granted.
        Role role,
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
    address[] public admins_accounts;
    address[] private super_admins_accounts;
    // Owner of the smart contract.
    constructor(address initialOwner) Ownable(initialOwner){
        admins[initialOwner] = Role.SuperAdmin;
    }

    function ensureSuperAdmin(address _addr) internal view returns (bool){
        return uint(admins[_addr]) == uint(Role.SuperAdmin);
    }

    function ensureAdminDoNotExist(address _addr) internal view returns (bool){
        for (uint256 i = 0; i < super_admins_accounts.length; i++) {
            if (admins_accounts[i] == _addr) {
               return false;
            }
        }
        return true;
    }

    function ensureSuperAdminDoNotExist(address _addr) internal view returns (bool){
        for (uint256 i = 0; i < super_admins_accounts.length; i++) {
            if (super_admins_accounts[i] == _addr) {
               return false;
            }
        }
        return true;
    }


    /// @dev Allow a superAdmin.
    function addSuperAdmin(address _addr) external onlyOwner {
        require(ensureSuperAdminDoNotExist(_addr));
        require(ensureAdminDoNotExist(_addr));
        // todo factory call to deploy the contract and get the deployment address deployment address
        address _deployedTO = address(0);
        admins[_addr] = Role.SuperAdmin;
        super_admins_accounts.push(_addr);
        emit Granted(msg.sender,_addr, Role.SuperAdmin, _deployedTO);
    }

    /// @dev Remove a superAdmin.
    function removeSuperAdmin(address _addr) external onlyOwner {
        for (uint256 i = 0; i < super_admins_accounts.length; i++) {
            if (super_admins_accounts[i] == _addr) {
               delete super_admins_accounts[i];
            }
        }
        //address _deployedTO = address(0);
        admins[_addr] = Role.None;
        super_admins_accounts.push(_addr);
        emit Granted(msg.sender,_addr, Role.None, _addr);
    }

     /// @dev Allow an Admin.
    function addAdmin(address new_admin, address new_contract) external {
        require(ensureSuperAdmin(msg.sender), "not super admin");
        require(ensureAdminDoNotExist(new_admin), "admin exists");
        require(admins[new_admin] == Role.None, "role already set");
        // todo factory call to deploy the contract and get the deployment address deployment address
        admins[new_admin] = Role.Admin;
        admins_contracts[new_admin] = new_admin; // change this with deployed adress
        admins_accounts.push(new_admin);
        emit Granted(msg.sender,new_admin, Role.Admin , new_contract);
    }



} 

