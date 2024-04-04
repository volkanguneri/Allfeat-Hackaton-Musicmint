// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol"; 
import "./Albums.sol";
/// @custom:security-contact contact@adrien-v.com
/**
 * @title Admins Contract
 * @dev Manages administrative privileges in a smart contract system.
 * @notice This contract allows for the addition and removal of admin addresses.
 */
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
    
    /**
     * @dev Constructor that sets the deployer as the initial admin.
     */
    constructor(address initialOwner) Ownable(initialOwner){
        adminRoles[initialOwner] = Role.SuperAdmin;
    }

    /**
    * @dev Checks if the given address is assigned the SuperAdmin role.
    * This function is internal and can be used within the contract to ensure that
    * an operation is being performed by a SuperAdmin.
    * @param _addr The address to check for the SuperAdmin role.
    * @return bool Returns true if the address is a SuperAdmin, false otherwise.
    */
    function ensureSuperAdmin(address _addr) internal view returns (bool){
        return uint(adminRoles[_addr]) == uint(Role.SuperAdmin);
    }

    /**
    * @dev Ensures that the given address is not already present in the `adminsAccounts` array.
    * This check helps in avoiding duplicate admin entries. Since this function iterates
    * over the `adminsAccounts` array, be cautious of gas costs when the array size grows.
    * @param _addr The address to verify against the admin accounts mapping.
    * @return bool Returns true if the address is not an admin, false if it already exists as an admin.
    */
    function ensureAdminDoNotExist(address _addr) internal view returns (bool){
         return uint(adminRoles[_addr]) == uint(Role.None);
    }

    /**
    * @dev Verifies that the given address is not already listed in the `superAdminsAccounts` array.
    * Useful for maintaining a clean list of SuperAdmins without duplicates. As with `ensureAdminDoNotExist`,
    * be mindful of potential gas costs due to array iteration.
    * @param _addr The address to check against the super admin accounts list.
    * @return bool Returns true if the address is not a super admin, false if it already exists as a super admin.
    */
    function ensureSuperAdminDoNotExist(address _addr) internal view returns (bool){
        return uint(adminRoles[_addr]) == uint(Role.None);
    }

    /**
    * @dev Adds a new SuperAdmin to the contract.
    * This function can only be called by the contract owner. It ensures that the address being added does not already exist as either a SuperAdmin or Admin. After verification, it assigns the SuperAdmin role to the address and emits an event.
    * @param _addr Address to be added as a SuperAdmin.
    * @notice This action is irreversible through this function and can only be performed by the contract owner.
    */    
    function addSuperAdmin(address _addr) external onlyOwner {
        require(ensureSuperAdminDoNotExist(_addr) && ensureAdminDoNotExist(_addr), "role already set");
        // todo factory call to deploy the contract and get the deployment address deployment address
        address _deployedTO = address(0);
        adminRoles[_addr] = Role.SuperAdmin;
        superAdminsAccounts.push(_addr);
        emit Granted(msg.sender,_addr, Role.SuperAdmin, _deployedTO);
    }

    /**
    * @dev Removes a super administrator from the contract.
    * This function allows the contract owner to remove an address from the list of super administrators. 
    * It updates the admin's role to 'None' and emits a 'Granted' event indicating the role change.
    * Note: This function should be called only by the contract owner.
    * @param _addr The address to be removed from the super administrators list.
    * @notice Ensure that the address being removed is indeed a super administrator and that 
    * you have the necessary permissions to perform this action.
    */
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

    /**
     * @dev Adds a new admin.
     * @param newAdmin Address to be added as admin.
     * @notice Only existing superadmins can add new admins.
     //TODO newContract will be removed to be used after deploy
     */
    function addAdmin(address newAdmin) external {
        require(ensureAdminDoNotExist(newAdmin), "admin exists");
        require(ensureSuperAdmin(msg.sender), "not super admin");
        require(adminRoles[newAdmin] == Role.None, "role already set");
        // todo factory call to deploy the contract and get the deployment address deployment address
        adminRoles[newAdmin] = Role.Admin;
        bytes memory collectionBytecode = type(Albums).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(newAdmin,  block.timestamp));
        address collectionAddress;
        // assembly {
        //     collectionAddress := create2(
        //         0,
        //         add(collectionBytecode, 0x20),
        //         mload(collectionBytecode),
        //         salt
        //     )
        //     if iszero(extcodesize(collectionAddress)) {
        //         // revert if something gone wrong (collectionAddress doesn't contain an address)
        //         revert(0, 0)
        //     }
        // }
        adminsContracts[newAdmin] = collectionAddress; // change this with deployed address
        adminsAccounts.push(collectionAddress);
        emit Granted(msg.sender,newAdmin, Role.Admin, collectionAddress);
    }

    function removeAdmin(address oldAdmin) external {
        require(ensureSuperAdmin(msg.sender), "not super admin caller");
        require(adminRoles[oldAdmin] == Role.Admin, "not an admin");
        // todo factory call to deploy the contract and get the deployment address deployment address
        adminRoles[oldAdmin] = Role.None;
        // deal with adminsContracts[oldAdmin] ?
        // remove it ? adminsAccounts.push(oldAdmin);
        emit Granted(msg.sender,oldAdmin, Role.None , oldAdmin);
    }



} 

