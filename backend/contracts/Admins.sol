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
    mapping(address => Role) public adminRoles;
    mapping(address => address) public adminsContracts;
    address[] public adminsAccounts;
    address[] private superAdminsAccounts;
    // Owner of the smart contract.
    constructor(address initialOwner) Ownable(initialOwner){
        adminRoles[initialOwner] = Role.SuperAdmin;
    }

    function ensureSuperAdmin(address _addr) internal view returns (bool){
        return uint(adminRoles[_addr]) == uint(Role.SuperAdmin);
    }

    function ensureAdminDoNotExist(address _addr) internal view returns (bool){
        for (uint256 i = 0; i < superAdminsAccounts.length; i++) {
            if (adminsAccounts[i] == _addr) {
               return false;
            }
        }
        return true;
    }

    function ensureSuperAdminDoNotExist(address _addr) internal view returns (bool){
        for (uint256 i = 0; i < superAdminsAccounts.length; i++) {
            if (superAdminsAccounts[i] == _addr) {
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
        adminRoles[_addr] = Role.SuperAdmin;
        superAdminsAccounts.push(_addr);
        emit Granted(msg.sender,_addr, Role.SuperAdmin, _deployedTO);
    }

    /// @dev Remove a superAdmin.
    function removeSuperAdmin(address _addr) external onlyOwner {
        for (uint256 i = 0; i < superAdminsAccounts.length; i++) {
            if (superAdminsAccounts[i] == _addr) {
               delete superAdminsAccounts[i];
            }
        }
        //address _deployedTO = address(0);
        adminRoles[_addr] = Role.None;
        superAdminsAccounts.push(_addr);
        emit Granted(msg.sender,_addr, Role.None, _addr);
    }

     /// @dev Allow an Admin.
    function addAdmin(address new_admin, address newContract) external {
        require(ensureSuperAdmin(msg.sender), "not super admin");
        require(ensureAdminDoNotExist(new_admin), "admin exists");
        require(adminRoles[new_admin] == Role.None, "role already set");
        // todo factory call to deploy the contract and get the deployment address deployment address
        adminRoles[new_admin] = Role.Admin;
        adminsContracts[new_admin] = new_admin; // change this with deployed adress
        adminsAccounts.push(new_admin);
        emit Granted(msg.sender,new_admin, Role.Admin , newContract);
    }



} 

