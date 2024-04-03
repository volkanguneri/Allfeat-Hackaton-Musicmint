#![cfg_attr(not(feature = "std"), no_std, no_main)]

//! Album smart contract prototype for Allfeat

/// Possible design for ipfs storage
/// ```json
/// {
///    "album": {
///      "id": "AlbumId",
///      "title": "Album title",
///      "description": "Song description",
///      "artists":  ["Main artist", "Artist 2", "Artist 3"],
///      "cover": "ipfs://Qm.../cover.jpg",
///      "price": "0.1",
///    }
/// }
///
/// {
///   "song": {
///       "id": "SongId",
///       "title": "Song title",
///       "description": "Song description",
///       "image": "ipfs://Qm.../cover.jpg",
///       "audio": "ipfs://Qm.../audio.mp3",
///       "price": "0.1"
///     }
/// }
/// ```
#[openbrush::implementation(Ownable)]
#[allfeat_contracts::implementation(AFT37, AFT37URIStorage, AFT37PayableMint)]
#[allfeat_contracts::contract]
pub mod albums {
    use allfeat_contracts::aft37::{
        self,
        extensions::{
            payable_mint::{self, AFT37PayableMintImpl},
            uri_storage::URI,
        },
        AFT37Error,
    };
    use ink::{prelude::vec, storage::Mapping};
    use openbrush::{contracts::ownable::OwnableError, traits::Storage};
    use scale::{Decode, Encode};

    /// Event emitted when an artist creates a song or an album.
    #[ink(event)]
    pub struct ItemCreated {
        /// The artist.
        from: AccountId,
        /// Album id.
        album_id: AlbumId,
        /// Song id.
        song_id: SongId,
        /// Max supply of the creation.
        max_supply: Balance,
        /// The URI of the creation.
        uri: URI,
    }

    /// Event emitted when an artist deletes an album or a song.
    #[ink(event)]
    pub struct ItemDeleted {
        /// Album id.
        album_id: AlbumId,
        /// Song id.
        song_id: SongId,
    }

    /// Event emitted when a user mints a creation (song or album).
    #[ink(event)]
    pub struct ItemMinted {
        /// The artist.
        from: AccountId,
        /// The fan.
        to: AccountId,
        /// Album id.
        album_id: AlbumId,
        /// Song id.
        song_id: SongId,
    }

    /// The main contract structure.
    #[derive(Storage)]
    #[ink(storage)]
    pub struct Contract {
        /// The aft37 data structure, managing the balances, supply, and operator approvals.
        #[storage_field]
        data: aft37::Data,

        /// The payable mint data structure, managing the price and max supply of each token.
        #[storage_field]
        payable_mint: payable_mint::Data,

        /// The ownable data structure, managing the owner of the contract.
        #[storage_field]
        ownable: ownable::Data,

        /// The URI storage data structure, managing the base URI and token URIs.
        #[storage_field]
        uris: uri_storage::Data,

        /// A mapping of denied IDs. These IDs are not allowed to be used.
        /// Can be useful if you want to disable minting a specific song/entire album.
        denied_ids: Mapping<Id, ()>,

        /// A mapping of albums to their respective songs.
        /// - Key: AlbumId (a unique identifier for an album).
        /// - Value: A vector of SongIds (unique identifiers for songs).
        ///
        /// Logic:
        /// - Every time a new album is created, a unique AlbumId is generated.
        /// - Every song added to this album gets a unique SongId.
        /// - The AlbumId serves as the key in this mapping, and the associated SongIds are
        ///   stored in the vector as the value.
        /// - The combination of AlbumId and SongId ensures a unique identifier for each song
        ///   across all albums. The AlbumId occupies the higher 16 bits of a 32-bit ID, and
        ///   the SongId occupies the lower 16 bits.
        songs: Mapping<AlbumId, Vec<SongId>>,

        /// The current album ID. Used to generate next one.
        current_album_id: AlbumId,
    }

    /// AlbumId represents a unique identifier for an album.
    /// It uses 16 bits, allowing for a maximum of 2^16 or 65,536 unique albums.
    /// The AlbumId occupies the higher bits (16-31) of the combined 32-bit ID for a song.
    type AlbumId = u16;

    /// SongId represents a unique identifier for a song within a specific album.
    /// It uses 16 bits, allowing for a maximum of 2^16 or 65,536 unique songs per album.
    /// The SongId occupies the lower bits (0-15) of the combined 32-bit ID for a song.
    type SongId = u16;

    /// Combines an `AlbumId` and a `SongId` to produce a unique 32-bit identifier (`Id`).
    ///
    /// This function takes an `AlbumId` and a `SongId` (both 16 bits) and combines them to
    /// produce a unique 32-bit identifier (`Id`). The resulting `Id` can be used as a key
    /// for mappings or other data structures where a unique identification for a song within
    /// an album is needed.
    ///
    /// In order to create the Id of an AlbumId, just pass SongId as 0.
    ///
    /// Example:
    ///
    /// `AlbumId` : 0000000000010101 -> 21 in decimal
    /// `SongId`  : 0000000000000000 -> 0 in decimal
    /// `Id`      : 00000000000101010000000000000000 -> 1376256 in decimal
    ///
    /// So, the combined Id in binary is 00000000000101010000000000000000 which is 1376256 in decimal.
    ///
    /// - If `SongId`` is 0000000000000000, then it represents an album.
    /// - If SongId is anything other than 0000000000000000, it represents a song within the album specified by the AlbumId.
    fn combine_ids(album_id: AlbumId, song_id: SongId) -> Id {
        // Shift the AlbumId 16 bits to the left to make space for the SongId
        let album_part = (album_id as u32) << 16;
        // Combine the two parts using a bitwise OR to get a unique u32 identifier
        Id::U32(album_part | (song_id as u32))
    }

    /// Checks wheter the given `Id` is an `AlbumId`.
    fn _is_album(id: &Id) -> bool {
        // Extract the SongId portion and check if it's 0
        match id {
            Id::U32(id) => (id & 0xFFFF) == 0,
            _ => false,
        }
    }

    /// Errors that can occur during execution of the contract.
    #[derive(Encode, Decode, Debug, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        NotOwner,
        InvalidAlbumId,
        InvalidSongId,
        DeniedId,
        Internal(AFT37Error),
    }

    impl From<OwnableError> for Error {
        fn from(_: OwnableError) -> Self {
            Error::NotOwner
        }
    }

    impl From<AFT37Error> for Error {
        fn from(e: AFT37Error) -> Self {
            Error::Internal(e)
        }
    }

    impl Contract {
        #[ink(constructor, payable)]
        pub fn new(base_uri: Option<URI>, owner: AccountId) -> Self {
            let mut instance = Self {
                data: aft37::Data::default(),
                denied_ids: Mapping::default(),
                songs: Mapping::default(),
                uris: uri_storage::Data::default(),
                ownable: ownable::Data::default(),
                payable_mint: payable_mint::Data::default(),
                current_album_id: 0,
            };

            uri_storage::Internal::_set_base_uri(&mut instance, base_uri);
            ownable::InternalImpl::_init_with_owner(&mut instance, owner);

            instance
        }

        /// Denies an ID from being used.
        #[ink(message)]
        #[openbrush::modifiers(only_owner)]
        pub fn deny(&mut self, album_id: AlbumId, song_id: SongId) -> Result<(), Error> {
            self.denied_ids.insert(&combine_ids(album_id, song_id), &());

            Ok(())
        }

        /// Creates an album.
        #[ink(message)]
        #[openbrush::modifiers(only_owner)]
        pub fn create_album(
            &mut self,
            max_supply: Balance,
            price: Balance,
            album_uri: URI,
        ) -> Result<Id, Error> {
            // Insert new album into songs mapping
            self.songs
                .insert(self.current_album_id, &Vec::<SongId>::new());

            let token_id = combine_ids(self.current_album_id, 0);

            self.payable_mint.price_per_mint.insert(&token_id, &price);
            self.payable_mint
                .max_supply
                .insert(&token_id, &(max_supply as u64));
            self.uris.token_uris.insert(&token_id, &album_uri);

            self.env().emit_event({
                ItemCreated {
                    from: self.env().caller(),
                    album_id: self.current_album_id,
                    uri: album_uri,
                    song_id: 0,
                    max_supply,
                }
            });

            // Increment current AlbumId counter
            self.current_album_id += 1;

            Ok(token_id)
        }

        /// Creates a song within an album.
        #[ink(message)]
        #[openbrush::modifiers(only_owner)]
        pub fn create_song(
            &mut self,
            album_id: AlbumId,
            max_supply: Balance,
            price: Balance,
            song_uri: URI,
        ) -> Result<Id, Error> {
            let mut album = self.songs.get(album_id).ok_or(Error::InvalidAlbumId)?;
            let song_id = (album.len() + 1) as SongId;
            let token_id = combine_ids(album_id, song_id);

            // Add song into album
            album.push(song_id);
            self.songs.insert(album_id, &album);

            self.payable_mint.price_per_mint.insert(&token_id, &price);
            self.payable_mint
                .max_supply
                .insert(&token_id, &(max_supply as u64));
            self.uris.token_uris.insert(&token_id, &song_uri);

            self.env().emit_event({
                ItemCreated {
                    from: self.env().caller(),
                    uri: song_uri,
                    album_id,
                    song_id,
                    max_supply,
                }
            });

            Ok(token_id)
        }

        /// Deletes an album.
        #[ink(message)]
        #[openbrush::modifiers(only_owner)]
        pub fn delete_album(&mut self, album_id: AlbumId) -> Result<(), Error> {
            self.songs.get(album_id).ok_or(Error::InvalidAlbumId)?;

            if (album_id == self.current_album_id) && (self.current_album_id > 0) {
                self.current_album_id -= 1;
            }

            // Remove album from songs mapping
            self.songs.remove(self.current_album_id);
            self.env().emit_event({
                ItemDeleted {
                    album_id: self.current_album_id,
                    song_id: 0,
                }
            });

            Ok(())
        }

        /// Deletes a song from an album.
        #[ink(message)]
        #[openbrush::modifiers(only_owner)]
        pub fn delete_song(&mut self, album_id: AlbumId, song_id: SongId) -> Result<(), Error> {
            self.songs
                .get(album_id)
                .ok_or(Error::InvalidAlbumId)?
                .get(song_id as usize)
                .ok_or(Error::InvalidSongId)?;

            // Remove song from songs mapping
            self.songs.remove(song_id);
            self.env().emit_event(ItemDeleted { album_id, song_id });

            Ok(())
        }

        /// Mintes a new album to the caller.
        #[ink(message, payable)]
        pub fn mint_album(&mut self, album_id: AlbumId) -> Result<Id, Error> {
            let id = combine_ids(album_id, 0);
            let caller = self.env().caller();

            if self.denied_ids.get(&id).is_some() {
                return Err(Error::DeniedId);
            }

            allfeat_contracts::aft37::extensions::payable_mint::AFT37PayableMintImpl::mint(
                self,
                caller,
                vec![(id.clone(), 1)],
            )?;

            self.env().emit_event({
                ItemMinted {
                    from: self.ownable.owner.get().unwrap().unwrap(),
                    to: caller,
                    song_id: 0,
                    album_id,
                }
            });

            Ok(id)
        }

        /// Mintes a new song to the caller.
        #[ink(message, payable)]
        pub fn mint_song(&mut self, album_id: AlbumId, song_id: SongId) -> Result<Id, Error> {
            let id = combine_ids(album_id, song_id);
            let caller = self.env().caller();

            if self.denied_ids.get(&id).is_some() {
                return Err(Error::DeniedId);
            }

            allfeat_contracts::aft37::extensions::payable_mint::AFT37PayableMintImpl::mint(
                self,
                caller,
                vec![(id.clone(), 1)],
            )?;

            self.env().emit_event({
                ItemMinted {
                    from: self.ownable.owner.get().unwrap().unwrap(),
                    to: caller,
                    album_id,
                    song_id,
                }
            });

            Ok(id)
        }
    }
    // #[cfg(all(test, feature = "e2e-tests"))]
    // pub mod tests {
    //     use allfeat_contracts::aft37::aft37_external::AFT37;

    //     #[rustfmt::skip]
    //     use super::*;
    //     #[rustfmt::skip]
    //     use ink_e2e::build_message;

    //     use test_helpers::{address_of, balance_of_37};

    //     type E2EResult<T> = Result<T, Box<dyn std::error::Error>>;

    //     #[ink_e2e::test]
    //     async fn balance_of_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
    //         let constructor = ContractRef::new();
    //         let address = client
    //             .instantiate("albums", &ink_e2e::alice(), constructor, 0, None)
    //             .await
    //             .expect("instantiate failed")
    //             .account_id;

    //         let token_1 = Id::U8(0);
    //         let token_2 = Id::U8(1);

    //         let amount_1 = 1;
    //         let amount_2 = 20;

    //         assert_eq!(balance_of_37!(client, address, alice, None), 0);

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token_1.clone(), amount_1));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("mint failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token_2.clone(), amount_2));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("mint failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_1.clone())),
    //             amount_1
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_2.clone())),
    //             amount_2
    //         );
    //         assert_eq!(balance_of_37!(client, address, alice, None), 2);

    //         Ok(())
    //     }

    //     #[ink_e2e::test]
    //     async fn total_supply_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
    //         let constructor = ContractRef::new();
    //         let address = client
    //             .instantiate("albums", &ink_e2e::alice(), constructor, 0, None)
    //             .await
    //             .expect("instantiate failed")
    //             .account_id;

    //         let token_1 = Id::U8(0);
    //         let token_2 = Id::U8(1);

    //         let amount_1 = 1;
    //         let amount_2 = 20;

    //         let total_supply = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.total_supply(None));
    //             client.call_dry_run(&ink_e2e::alice(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert_eq!(total_supply, 0);

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token_1.clone(), amount_1.clone()));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         let total_supply_1 = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.total_supply(Some(token_1.clone())));
    //             client.call_dry_run(&ink_e2e::alice(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert_eq!(total_supply_1.clone(), amount_1.clone());

    //         let total_supply_2 = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.total_supply(None));
    //             client.call_dry_run(&ink_e2e::alice(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert_eq!(total_supply_2, 1);

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token_2.clone(), amount_2.clone()));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         let total_supply_1 = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.total_supply(Some(token_2.clone())));
    //             client.call_dry_run(&ink_e2e::alice(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert_eq!(total_supply_1.clone(), amount_2.clone());

    //         let total_supply_2 = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.total_supply(None));
    //             client.call_dry_run(&ink_e2e::alice(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert_eq!(total_supply_2.clone(), 2);

    //         Ok(())
    //     }

    //     #[ink_e2e::test]
    //     async fn allowance_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
    //         let constructor = ContractRef::new();
    //         let address = client
    //             .instantiate("albums", &ink_e2e::alice(), constructor, 0, None)
    //             .await
    //             .expect("instantiate failed")
    //             .account_id;

    //         let token = Id::U8(0);

    //         let allowance = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.allowance(address_of!(alice), address_of!(bob), Some(token.clone()))
    //             });
    //             client.call_dry_run(&ink_e2e::alice(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert_eq!(allowance, 0);

    //         let approve_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.approve(address_of!(bob), Some(token.clone()), 10));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("approve failed")
    //         }
    //         .return_value();

    //         assert_eq!(approve_tx, Ok(()));

    //         let allowance = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.allowance(address_of!(alice), address_of!(bob), Some(token.clone()))
    //             });
    //             client.call_dry_run(&ink_e2e::alice(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert_eq!(allowance, 10);

    //         Ok(())
    //     }

    //     #[ink_e2e::test]
    //     async fn transfer_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
    //         let constructor = ContractRef::new();
    //         let address = client
    //             .instantiate("albums", &ink_e2e::alice(), constructor, 0, None)
    //             .await
    //             .expect("instantiate failed")
    //             .account_id;

    //         let token_1 = Id::U8(0);
    //         let token_2 = Id::U8(1);

    //         let amount_1 = 1;
    //         let amount_2 = 10;

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token_1.clone(), amount_1.clone()));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token_2.clone(), amount_2.clone()));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         assert_eq!(balance_of_37!(client, address, alice, None), 2);
    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_1.clone())),
    //             amount_1
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_2.clone())),
    //             amount_2
    //         );

    //         let total_supply = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.total_supply(None));
    //             client.call_dry_run(&ink_e2e::alice(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert_eq!(total_supply, 2);

    //         let transfer_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.transfer(address_of!(bob), token_2.clone(), amount_2, vec![])
    //             });
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(transfer_tx, Ok(()));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_1.clone())),
    //             amount_1
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_2.clone())),
    //             0
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, bob, Some(token_1.clone())),
    //             0
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, bob, Some(token_2.clone())),
    //             amount_2
    //         );
    //         assert_eq!(balance_of_37!(client, address, alice, None), 1);
    //         assert_eq!(balance_of_37!(client, address, bob, None), 1);

    //         let transfer_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.transfer(address_of!(bob), token_1.clone(), amount_1, vec![])
    //             });
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(transfer_tx, Ok(()));

    //         let transfer_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.transfer(address_of!(alice), token_2.clone(), amount_1, vec![])
    //             });
    //             client
    //                 .call(&ink_e2e::bob(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(transfer_tx, Ok(()));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_1.clone())),
    //             0
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_2.clone())),
    //             amount_1
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, bob, Some(token_1.clone())),
    //             amount_1
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, bob, Some(token_2.clone())),
    //             amount_2 - amount_1
    //         );
    //         assert_eq!(balance_of_37!(client, address, alice, None), 1);
    //         assert_eq!(balance_of_37!(client, address, bob, None), 2);

    //         Ok(())
    //     }

    //     #[ink_e2e::test]
    //     async fn transfer_from_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
    //         let constructor = ContractRef::new();
    //         let address = client
    //             .instantiate("albums", &ink_e2e::alice(), constructor, 0, None)
    //             .await
    //             .expect("instantiate failed")
    //             .account_id;

    //         let token_1 = Id::U8(0);
    //         let token_2 = Id::U8(1);

    //         let amount_1 = 1;
    //         let amount_2 = 10;

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token_1.clone(), amount_1.clone()));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token_2.clone(), amount_2.clone()));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         let approve_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.approve(address_of!(alice), None, 1));
    //             client
    //                 .call(&ink_e2e::bob(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(approve_tx, Ok(()));

    //         let transfer_from_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.transfer_from(
    //                     address_of!(alice),
    //                     address_of!(bob),
    //                     token_2.clone(),
    //                     amount_2,
    //                     vec![],
    //                 )
    //             });
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(transfer_from_tx, Ok(()));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_1.clone())),
    //             amount_1
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_2.clone())),
    //             0
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, bob, Some(token_1.clone())),
    //             0
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, bob, Some(token_2.clone())),
    //             amount_2
    //         );

    //         let transfer_from_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.transfer_from(
    //                     address_of!(alice),
    //                     address_of!(bob),
    //                     token_1.clone(),
    //                     amount_1,
    //                     vec![],
    //                 )
    //             });
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(transfer_from_tx, Ok(()));

    //         let transfer_from_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.transfer_from(
    //                     address_of!(bob),
    //                     address_of!(alice),
    //                     token_2.clone(),
    //                     amount_1,
    //                     vec![],
    //                 )
    //             });
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(transfer_from_tx, Ok(()));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_1.clone())),
    //             0
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token_2.clone())),
    //             amount_1
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, bob, Some(token_1.clone())),
    //             amount_1
    //         );
    //         assert_eq!(
    //             balance_of_37!(client, address, bob, Some(token_2.clone())),
    //             amount_2 - amount_1
    //         );

    //         Ok(())
    //     }

    //     #[ink_e2e::test]
    //     async fn transfer_from_insufficient_balance_should_fail(
    //         mut client: ink_e2e::Client<C, E>,
    //     ) -> E2EResult<()> {
    //         let constructor = ContractRef::new();
    //         let address = client
    //             .instantiate("albums", &ink_e2e::alice(), constructor, 0, None)
    //             .await
    //             .expect("instantiate failed")
    //             .account_id;

    //         let token = Id::U8(0);
    //         let amount = 1;

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token.clone(), amount.clone()));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token.clone())),
    //             amount
    //         );

    //         let approve_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.approve(address_of!(alice), Some(token.clone()), amount)
    //             });
    //             client
    //                 .call(&ink_e2e::bob(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(approve_tx, Ok(()));

    //         let transfer_from_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.transfer_from(
    //                     address_of!(bob),
    //                     address_of!(alice),
    //                     token.clone(),
    //                     amount + 1,
    //                     vec![],
    //                 )
    //             });
    //             client.call_dry_run(&ink_e2e::bob(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert!(matches!(transfer_from_tx, Err(_)));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token.clone())),
    //             amount
    //         );

    //         Ok(())
    //     }

    //     #[ink_e2e::test]
    //     async fn transfer_from_without_allowance_should_fail(
    //         mut client: ink_e2e::Client<C, E>,
    //     ) -> E2EResult<()> {
    //         let constructor = ContractRef::new();
    //         let address = client
    //             .instantiate("albums", &ink_e2e::alice(), constructor, 0, None)
    //             .await
    //             .expect("instantiate failed")
    //             .account_id;

    //         let token = Id::U8(0);
    //         let amount = 1;

    //         let mint_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone())
    //                 .call(|contract| contract.mint_tokens(token.clone(), amount.clone()));
    //             client
    //                 .call(&ink_e2e::alice(), _msg, 0, None)
    //                 .await
    //                 .expect("call failed")
    //         }
    //         .return_value();

    //         assert_eq!(mint_tx, Ok(()));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token.clone())),
    //             amount
    //         );

    //         let transfer_from_tx = {
    //             let _msg = build_message::<ContractRef>(address.clone()).call(|contract| {
    //                 contract.transfer_from(
    //                     address_of!(bob),
    //                     address_of!(alice),
    //                     token.clone(),
    //                     amount + 1,
    //                     vec![],
    //                 )
    //             });
    //             client.call_dry_run(&ink_e2e::bob(), &_msg, 0, None).await
    //         }
    //         .return_value();

    //         assert!(matches!(transfer_from_tx, Err(_)));

    //         assert_eq!(
    //             balance_of_37!(client, address, alice, Some(token.clone())),
    //             amount
    //         );

    //         Ok(())
    //     }
    // }
}
