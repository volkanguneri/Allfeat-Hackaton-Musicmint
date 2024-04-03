// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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

    function ensure_super_admin(address _addr) internal view returns (bool){
        return uint(admins[_addr]) == 2;
    }

    function ensure_admin_do_not_exist(address _addr) internal view returns (bool){
        for (uint256 i = 0; i < super_admins_accounts.length; i++) {
            if (admins_accounts[i] == _addr) {
               return false;
            }
        }
        return true;
    }

    function ensure_superadmin_do_not_exist(address _addr) internal view returns (bool){
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
        require(ensure_superadmin_do_not_exist(_addr));
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
        //address _deployedTO = address(0);
        admins[_addr] = Role(0);
        super_admins_accounts.push(_addr);
        emit Granted(msg.sender,_addr, 0, _addr);
    }

     /// @dev Allow an Admin.
    function add_admin(address new_admin, address new_contract) external {
        require(ensure_super_admin(msg.sender));
        require(ensure_admin_do_not_exist(new_admin));
        // todo factory call to deploy the contract and get the deployment address deployment address
        admins[new_admin] = Role(1);
        admins_accounts.push(new_admin);
        emit Granted(msg.sender,new_admin, 1, new_contract);
    }



} 

