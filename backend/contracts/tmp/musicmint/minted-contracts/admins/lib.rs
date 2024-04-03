#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod admin {
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;
    use scale::{Decode, Encode};

    /// Event emitted when a user is granted a role.
    #[ink(event)]
    pub struct Granted {
        /// Granter of the role.
        from: AccountId,
        /// Grantee of the role.
        to: AccountId,
        /// The role granted.
        role: Role,
        contract: AccountId,
    }

    /// The role of a user.
    #[derive(Encode, Decode, Eq, PartialEq, Default, Debug)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum Role {
        #[default]
        None,
        Admin,
        SuperAdmin,
    }

    #[derive(Encode, Decode, Debug, PartialEq, Eq, Copy, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        NotOwner,
        NotSuperAdmin,
        GivenWalletIsNotSuperAdmin,
        GivenWalletIsNotAdmin,
        AdminAlreadyExist,
        SuperAdminAlreadyExist,
    }

    #[ink(storage)]
    pub struct Admin {
        /// Mapping of the user roles.
        admins: Mapping<AccountId, Role>,
        admins_contracts: Mapping<AccountId, AccountId>,
        admins_accounts: Vec<AccountId>,
        super_admins_accounts: Vec<AccountId>,
        /// Owner of the smart contract.
        owner: AccountId,
    }

    impl Admin {
        /// Creates a new admin contract initialized with the given owner.
        #[ink(constructor)]
        pub fn new(owner: AccountId) -> Self {
            Self {
                admins: Mapping::new(),
                admins_contracts: Mapping::new(),
                admins_accounts: Vec::new(),
                super_admins_accounts: Vec::new(),
                owner,
            }
        }

        /// Adds the admin role to the given `AccountId`.
        /// The smart contract caller must be the owner.
        #[ink(message)]
        pub fn add_super_admin(&mut self, new_admin: AccountId) -> Result<(), Error> {
            self.ensure_owner()?;
            self.ensure_admin_do_not_exist(new_admin)?;

            self.admins.insert(new_admin, &Role::SuperAdmin);
            self.super_admins_accounts.push(new_admin);

            self.env().emit_event({
                Granted {
                    from: self.env().caller(),
                    to: new_admin,
                    role: Role::SuperAdmin,
                    contract: [0u8; 32].into(),
                }
            });
            Ok(())
        }

        /// Removes the super admin role from the given `AccountId`.
        /// The smart contract caller must be the owner.
        #[ink(message)]
        pub fn remove_super_admin(&mut self, admin: AccountId) -> Result<(), Error> {
            self.ensure_owner()?;

            self.admins.insert(admin, &Role::None);
            let index = self
                .super_admins_accounts
                .iter()
                .position(|x| *x == admin)
                .ok_or(Error::GivenWalletIsNotSuperAdmin)?;
            self.super_admins_accounts.remove(index);

            self.env().emit_event({
                Granted {
                    from: self.env().caller(),
                    to: admin,
                    role: Role::None,
                    contract: [0u8; 32].into(),
                }
            });
            Ok(())
        }

        /// Adds the admin role to the given `AccountId`.
        /// The smart contract caller must be a super admin.
        #[ink(message)]
        pub fn add_admin(
            &mut self,
            new_admin: AccountId,
            new_contract: AccountId,
        ) -> Result<(), Error> {
            self.ensure_super_admins()?;
            self.ensure_admin_do_not_exist(new_admin)?;

            self.admins.insert(new_admin, &Role::Admin);
            self.admins_contracts.insert(new_admin, &new_contract);
            self.admins_accounts.push(new_admin);
            self.env().emit_event({
                Granted {
                    from: self.env().caller(),
                    to: new_admin,
                    role: Role::Admin,
                    contract: new_contract,
                }
            });
            Ok(())
        }

        /// Removes the admin role from the given `AccountId`.
        /// The smart contract caller must be a super admin.
        #[ink(message)]
        pub fn remove_admin(&mut self, admin: AccountId, contract: AccountId) -> Result<(), Error> {
            self.ensure_super_admins()?;

            self.admins.insert(admin, &Role::None);
            let index = self
                .admins_accounts
                .iter()
                .position(|x| *x == admin)
                .ok_or(Error::GivenWalletIsNotAdmin)?;
            self.admins_accounts.remove(index);

            self.env().emit_event({
                Granted {
                    from: self.env().caller(),
                    to: admin,
                    role: Role::None,
                    contract,
                }
            });
            Ok(())
        }

        /// Gets the role of the given `AccountId`.
        /// Returns `[0u8; 32].into()` if the given `AccountId` is not is the mapping.
        #[ink(message)]
        pub fn get_artist_contract(&self, admin: AccountId) -> Option<AccountId> {
            self.admins_contracts.get(admin)
        }

        /// Gets the smart contract address of the given `AccountId`.
        /// Returns `Role::None` if the given `AccountId` is not is the mapping.
        #[ink(message)]
        pub fn get_role(&self, admin: AccountId) -> Role {
            self.admins.get(admin).unwrap_or_default()
        }

        /// Gets all admins.
        /// Returns `Vec<AccountId>`
        #[ink(message)]
        pub fn get_all_admins(&self) -> Vec<AccountId> {
            self.admins_accounts.clone()
        }

        /// Gets all super admins.
        /// Returns `Vec<AccountId>`
        #[ink(message)]
        pub fn get_all_super_admins(&self) -> Vec<AccountId> {
            self.super_admins_accounts.clone()
        }

        /// Verifies that the caller is the smart contract's owner.
        fn ensure_owner(&self) -> Result<(), Error> {
            match self.env().caller() == self.owner {
                true => Ok(()),
                false => Err(Error::NotOwner),
            }
        }

        /// Verifies that new admin is not in the list already, as Admin or as SuperAdmin.
        fn ensure_admin_do_not_exist(&self, admin: AccountId) -> Result<(), Error> {
            //match !(self.admins.contains(admin) == true  && self.get_role(admin) == Role::Admin) {
            match !(self.get_role(admin) == Role::Admin || self.get_role(admin) == Role::SuperAdmin)
            {
                true => Ok(()),
                false => Err(Error::AdminAlreadyExist),
            }
        }

        /// Verifies that the caller is a super admin / the owner.
        fn ensure_super_admins(&self) -> Result<(), Error> {
            match self.admins.get(self.env().caller()).unwrap_or_default() == Role::SuperAdmin
                || self.env().caller() == self.owner
            {
                true => Ok(()),
                false => Err(Error::NotSuperAdmin),
            }
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn new_works() {
            let owner_id = AccountId::from([0x01; 32]);
            let admin = Admin::new(owner_id);

            assert_eq!(admin.owner, owner_id);
        }
    }

    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        use super::*;
        use ink_e2e::build_message;

        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        #[ink_e2e::test]
        async fn test_add_and_remove_super_admin(
            mut client: ink_e2e::Client<C, E>,
        ) -> E2EResult<()> {
            // Creates the contract with Alice account as owner.
            let constructor = AdminRef::new(ink_e2e::account_id(ink_e2e::AccountKeyring::Alice));
            let contract_acc_id = client
                .instantiate("admin", &ink_e2e::alice(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            // Alice adds Bob to the super admin role.
            let bob_account_id = ink_e2e::account_id(ink_e2e::AccountKeyring::Bob);
            let add_super_admin = build_message::<AdminRef>(contract_acc_id)
                .call(|admin| admin.add_super_admin(bob_account_id));
            let add_super_admin_res = client
                .call(&ink_e2e::alice(), add_super_admin, 0, None)
                .await
                .expect("add super admin failed");

            assert_eq!(add_super_admin_res.return_value(), Ok(()));

            // Fetchs the role of Bob
            let bob_role = build_message::<AdminRef>(contract_acc_id)
                .call(|admin| admin.get_role(bob_account_id));
            let bob_role_res = client
                .call(&ink_e2e::alice(), bob_role, 0, None)
                .await
                .expect("get role failed");

            // Verifies that Bob account is a super admin.
            assert_eq!(bob_role_res.return_value(), Role::SuperAdmin);

            // Alice removes Bob from the super admin role.
            let remove_super_admin = build_message::<AdminRef>(contract_acc_id)
                .call(|admin| admin.remove_super_admin(bob_account_id));
            let remove_super_admin_res = client
                .call(&ink_e2e::alice(), remove_super_admin, 0, None)
                .await
                .expect("remove super admin failed");

            assert_eq!(remove_super_admin_res.return_value(), Ok(()));

            // Fetchs the role of Bob
            let bob_role = build_message::<AdminRef>(contract_acc_id)
                .call(|admin| admin.get_role(bob_account_id));
            let bob_role_res = client
                .call(&ink_e2e::alice(), bob_role, 0, None)
                .await
                .expect("get role failed");

            // Verifies that Bob account is a not super admin anymore.
            assert_eq!(bob_role_res.return_value(), Role::None);
            Ok(())
        }

        #[ink_e2e::test]
        async fn test_add_and_remove_admin(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // Creates the contract with Alice account as owner.
            let constructor = AdminRef::new(ink_e2e::account_id(ink_e2e::AccountKeyring::Alice));
            let contract_acc_id = client
                .instantiate("admin", &ink_e2e::alice(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            // Alice adds Bob to the admin role.
            let bob_account_id = ink_e2e::account_id(ink_e2e::AccountKeyring::Bob);
            let add_admin = build_message::<AdminRef>(contract_acc_id)
                .call(|admin| admin.add_admin(bob_account_id, contract_acc_id));
            let add_admin_res = client
                .call(&ink_e2e::alice(), add_admin, 0, None)
                .await
                .expect("add admin failed");

            assert_eq!(add_admin_res.return_value(), Ok(()));

            // Fetchs the role of Bob
            let bob_role = build_message::<AdminRef>(contract_acc_id)
                .call(|admin| admin.get_role(bob_account_id));
            let bob_role_res = client
                .call(&ink_e2e::alice(), bob_role, 0, None)
                .await
                .expect("get role failed");

            // Verifies that Bob account is an admin.
            assert_eq!(bob_role_res.return_value(), Role::Admin);

            // Alice removes Bob from the admin role.
            let remove_admin = build_message::<AdminRef>(contract_acc_id)
                .call(|admin| admin.remove_admin(bob_account_id, contract_acc_id));
            let remove_admin_res = client
                .call(&ink_e2e::alice(), remove_admin, 0, None)
                .await
                .expect("remove admin failed");

            assert_eq!(remove_admin_res.return_value(), Ok(()));

            // Fetchs the role of Bob
            let bob_role = build_message::<AdminRef>(contract_acc_id)
                .call(|admin| admin.get_role(bob_account_id));
            let bob_role_res = client
                .call(&ink_e2e::alice(), bob_role, 0, None)
                .await
                .expect("get role failed");

            // Verifies that Bob account is not an admin anymore.
            assert_eq!(bob_role_res.return_value(), Role::None);
            Ok(())
        }
    }
}
