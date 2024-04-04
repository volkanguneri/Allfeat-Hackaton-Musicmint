// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Albums is Ownable {

    struct Album {
        uint64 maxSupply;
        uint64 price;
        string uri;
    }

    struct Song {
        uint16 id;
        uint64 maxSupply;
        uint64 price;
        string uri;
    }

    
    mapping(uint16 albumId => Album) private _albums;
    mapping(uint16 albumId => Song[] songs) private _albumSongs;

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

    constructor(address initialOwner) Ownable(initialOwner) {}
    
    function createAlbum(
        uint64 maxSupply,
        uint64 price,
        string memory album_uri
    ) external onlyOwner returns (uint256) {
        uint16 albumId = _currentAlbumId;

        _albums[albumId] = Album({
            maxSupply: maxSupply,
            price: price,
            uri: album_uri
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

        Album storage album = _albums[albumId];
        require(album.maxSupply > 0, "Album does not exist");

        uint256 numberOfSongs = _albumSongs[albumId].length;
        require(numberOfSongs < maxSupply, "Maximum supply reached");
        require(numberOfSongs <= type(uint16).max, "Value exceeds uint16 range");

        uint16 songId = uint16(numberOfSongs) + 1;

        _albumSongs[albumId].push(Song({
            id: songId,
            maxSupply: maxSupply,
            price: price,
            uri: songUri

        }));

        emit ItemCreated(msg.sender, albumId, songUri, songId, maxSupply);

        return songId;
    }

}