// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

contract Albums is OwnableUpgradeable, ERC1155Upgradeable {

    struct Album {
        uint16 id; // starts from 1 (0 is reserved for non existing album)
        uint64 maxSupply;
        uint64 price;
        string uri;
        uint16 currentSongId;
    }

    struct Song {
        uint16 id; // starts from 1 (0 is reserved for token ID representing an album)
        uint64 maxSupply;
        uint64 price;
        string uri;
    }
    
    mapping(uint16 albumId => Album) private _albums;
    mapping(uint16 albumId => mapping(uint16 songId => Song)) private _albumSongs;

    // The current album ID. Used to generate next one.
    uint16 private _currentAlbumId;

    event ItemCreated(
        address indexed from, // The artist who created the album
        uint16 album_id,
        string uri,
        uint16 song_id,
        uint256 maxSupply
    );

    event ItemMinted(
        address indexed from, // The artist who minted the album
        address indexed to, // The buyer of the album / song
        uint16 album_id,
        uint16 song_id
    );

    function initialize(
        address _user
    ) external initializer {
        __ERC1155_init(""); // TODO: Add metadata URI
        _transferOwnership(_user);
    }
    
    function createAlbum(
        uint64 maxSupply,
        uint64 price,
        string memory album_uri
    ) external onlyOwner returns (uint256) {
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(price > 0, "Price must be greater than 0");

        _currentAlbumId++;

        _albums[_currentAlbumId] = Album({
            id: _currentAlbumId,
            maxSupply: maxSupply,
            price: price,
            uri: album_uri,
            currentSongId: 0
        });

        emit ItemCreated(msg.sender, _currentAlbumId, album_uri, 0, maxSupply);

        return _currentAlbumId;
    }

    function createSong(
        uint16 albumId,
        uint64 maxSupply,
        uint64 price,
        string memory songUri
    ) external onlyOwner returns (uint256) {
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(bytes(songUri).length > 0, "URI must not be empty");

        Album storage album = _albums[albumId];
        require(album.maxSupply > 0, "Album does not exist");

        uint256 numberOfSongs = _albums[albumId].currentSongId;
        require(numberOfSongs < maxSupply, "Maximum supply reached");
        require(numberOfSongs <= type(uint16).max, "Value exceeds uint16 range");

        album.currentSongId++;

        uint16 songId = album.currentSongId;
    
        _albumSongs[albumId][songId] = Song({
            id: songId,
            maxSupply: maxSupply,
            price: price,
            uri: songUri
        });

        emit ItemCreated(msg.sender, albumId, songUri, songId, maxSupply);

        return songId;
    }

    function mintAlbum(uint16 albumId) external payable returns (uint256) {
        Album storage album = _albums[albumId];
        require(album.maxSupply > 0, "Album does not exist");
        require(album.price == msg.value, "Invalid price");

        uint256 tokenId = getTokenId(owner(), album.id, 0);
        _mint(msg.sender, tokenId, 1, "");

        emit ItemMinted(owner(), msg.sender, albumId, 0);

        return tokenId;
    }

    function mintSong(uint16 albumId, uint16 songId) external payable returns (uint256) {
        Album storage album = _albums[albumId];
        require(album.maxSupply > 0, "Album does not exist");

        Song storage song = _albumSongs[albumId][songId];
        require(song.maxSupply > 0, "Song does not exist");
        require(song.price == msg.value, "Invalid price");

        uint256 tokenId = getTokenId(owner(), album.id, song.id);
        _mint(msg.sender, tokenId, 1, "");

        emit ItemMinted(owner(), msg.sender, album.id, song.id);

        return tokenId;
    }

    function getAlbum(uint16 albumId) external view returns (Album memory) {
        return _albums[albumId];
    }

    function getAlbumsCount() external view returns (uint256) {
        return _currentAlbumId;
    }

    function getSong(uint16 albumId, uint16 songId) external view returns (Song memory) {
        return _albumSongs[albumId][songId];
    }

    function getAlbumSongsCount(uint16 albumId) external view returns (uint256) {
        return _albums[albumId].currentSongId;
    }

    /**
     * Produce a unique token ID, combining the artist's address with the album and song id.
     */
    function getTokenId(address artistAddress, uint16 albumId, uint16 songId) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(artistAddress, albumId, songId)));
    }

}