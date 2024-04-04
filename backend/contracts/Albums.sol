// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Albums is OwnableUpgradeable {

    struct Album {
        uint16 id;
        uint64 maxSupply;
        uint64 price;
        string uri;
        uint16 currentSongId;
    }

    struct Song {
        uint16 id;
        uint64 maxSupply;
        uint64 price;
        string uri;
    }

    
    mapping(uint16 albumId => Album) private _albums;
    mapping(uint16 albumId => mapping(uint16 songID => Song)) private _albumSongs;

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
        _transferOwnership(_user);
    }
    
    function createAlbum(
        uint64 maxSupply,
        uint64 price,
        string memory album_uri
    ) external onlyOwner returns (uint256) {
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(bytes(album_uri).length > 0, "URI must not be empty");

        uint16 albumId = _currentAlbumId;

        _albums[albumId] = Album({
            id: albumId,
            maxSupply: maxSupply,
            price: price,
            uri: album_uri,
            currentSongId: 0
        });

        emit ItemCreated(msg.sender, albumId, album_uri, 0, maxSupply);

        _currentAlbumId++;

        return albumId;
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

        uint16 songId = album.currentSongId;
        
    
        _albumSongs[albumId][songId] = Song({
            id: songId,
            maxSupply: maxSupply,
            price: price,
            uri: songUri
        });

        album.currentSongId++;

        emit ItemCreated(msg.sender, albumId, songUri, songId, maxSupply);

        return songId;
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

}