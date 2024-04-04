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
    address[] public adminsAccounts;
    address[] public super_adminsAccounts;
    // Owner of the smart contract.
    //address public owner;
    constructor(address initialOwner) Ownable(initialOwner){
        admins[initialOwner] = Role(2);
    }

    //function ensure_owner(address _addr) internal view returns (bool){
    //    return owner == _addr;
    //}

    function ensure_super_admin(address _addr) internal view returns (bool){
        return uint(admins[_addr]) == 2;
    }

    function ensure_admin_do_not_exist(address _addr) internal view returns (bool){
        for (uint256 i = 0; i < super_adminsAccounts.length; i++) {
            if (adminsAccounts[i] == _addr) {
               return false;
            }
        }
        return true;
    }

    function ensure_superadmin_do_not_exist(address _addr) internal view returns (bool){
        for (uint256 i = 0; i < super_adminsAccounts.length; i++) {
            if (super_adminsAccounts[i] == _addr) {
               return false;
            }
        }
        return true;
    }


    /// @dev Allow a superAdmin.
    function add_super_admin(address _addr) external onlyOwner {
        require(ensure_superadmin_do_not_exist(_addr));
        require(ensure_admin_do_not_exist(_addr));
        // todo factory call to deploy the contract and get the deployment address deployment address
        address _deployedTO = address(0);
        admins[_addr] = Role(2);
        super_adminsAccounts.push(_addr);
        emit Granted(msg.sender,_addr, 2, _deployedTO);
    }

    /// @dev Remove a superAdmin.
    function remove_super_admin(address _addr) external onlyOwner {
        for (uint256 i = 0; i < super_adminsAccounts.length; i++) {
            if (super_adminsAccounts[i] == _addr) {
               delete super_adminsAccounts[i];
            }
        }
        //address _deployedTO = address(0);
        admins[_addr] = Role(0);
        super_adminsAccounts.push(_addr);
        emit Granted(msg.sender,_addr, 0, _addr);
    }

     /// @dev Allow an Admin.
    function add_admin(address new_admin, address new_contract) external {
        require(ensure_super_admin(msg.sender), "not super admin");
        require(ensure_admin_do_not_exist(new_admin), "admin exists");
        require(admins[new_admin] == Role(0), "role already set");
        // todo factory call to deploy the contract and get the deployment address deployment address
        admins[new_admin] = Role(1);
        admins_contracts[new_admin] = new_admin; // change this with deployed adress
        adminsAccounts.push(new_admin);
        emit Granted(msg.sender,new_admin, 1, new_contract);
    }



} 

