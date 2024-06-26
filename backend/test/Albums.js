const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
require("ethers");
const { expect } = require("chai");

describe("Albums test", async function () {
  const deployAlbumsFixture = async () => {
    const [owner, otherAccount1] = await ethers.getSigners();

    const Albums = await ethers.getContractFactory("Albums");
    const albums = await Albums.deploy();
    await albums.initialize(owner.address);

    return { albums, owner, otherAccount1 };
  };

  it("should deploy with no errors", async function () {
    const { albums, owner } = await loadFixture(deployAlbumsFixture);
    expect(albums.address).is.not.null;
    expect(await albums.owner()).to.equal(owner.address);
  });

  describe("createAlbum", async function () {
    let albums, owner, otherAccount1;
    beforeEach(async () => {
      const result = await loadFixture(deployAlbumsFixture);
      albums = result.albums;
      owner = result.owner;
      otherAccount1 = result.otherAccount1;
    });

    it("should fail if it is not created by the owner", async function () {
      await expect(
        albums.connect(otherAccount1).createAlbum(100, 100, "uri album")
      ).to.be.revertedWithCustomError(albums, "OwnableUnauthorizedAccount");
    });

    it("should fail if price is 0", async function () {
      await expect(
        albums.connect(owner).createAlbum(1000, 0, "uri album")
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("should fail if maxSupply is 0", async function () {
      await expect(
        albums.connect(owner).createAlbum(0, 100, "uri album")
      ).to.be.revertedWith("Max supply must be greater than 0");
    });

    context("when the album is created", async function () {
      beforeEach(async function () {
        expect(await albums.getAlbumsCount()).to.equal(0);
        await albums.connect(owner).createAlbum(1000n, 100n, "uri album");
      });

      it("should create an album", async function () {
        expect(await albums.getAlbumsCount()).to.equal(1);
        const album = await albums.getAlbum(1);

        expect(album.id).to.equal(1);
        expect(album.price).to.equal(100);
        expect(album.maxSupply).to.equal(1000);
        expect(album.uri).to.equal("uri album");
      });

      it("should emit an ItemCreated event", async () => {
        expect(await albums.connect(owner).createAlbum(1000, 100, "uri"))
          .to.emit(albums, "ItemCreated")
          .withArgs(owner.address, 0, 1000, 100, "uri album");
      });

      describe("mintAlbum", async function () {
        it("should fail if albumId does not exist", async function () {
          await expect(
            albums.connect(otherAccount1).mintAlbum(0)
          ).to.be.revertedWith("Album does not exist");
        });

        it("should fail if price is 0", async function () {
          await expect(
            albums.connect(otherAccount1).mintAlbum(1)
          ).to.be.revertedWith("Invalid price");
        });

        context("when the album is minted", async function () {
          it("should mint an album", async function () {
            const tokenId = await albums.getTokenId(owner.address, 1, 0);

            expect(
              await albums.balanceOf(otherAccount1.address, tokenId)
            ).to.equal(0);

            await albums.connect(otherAccount1).mintAlbum(1, { value: 100 });

            expect(
              await albums.balanceOf(otherAccount1.address, tokenId)
            ).to.equal(1);
          });

          it("should emit an ItemMinted event", async () => {
            await expect(
              albums.connect(otherAccount1).mintAlbum(1, { value: 100 })
            )
              .to.emit(albums, "ItemMinted")
              .withArgs(owner.address, otherAccount1.address, 1, 0);
          });
        });
      });

      describe("createSong", async function () {
        it("should fail if it is not created by the owner", async function () {
          await expect(
            albums.connect(otherAccount1).createSong(0, 1000, 100, "uri song")
          ).to.be.revertedWithCustomError(albums, "OwnableUnauthorizedAccount");
        });

        it("should fail if albumId does not exist", async function () {
          await expect(
            albums.connect(owner).createSong(5, 1000, 100, "uri song")
          ).to.be.revertedWith("Album does not exist");
        });

        it("should fail if price is 0", async function () {
          await expect(
            albums.connect(owner).createSong(0, 1000, 0, "uri song")
          ).to.be.revertedWith("Price must be greater than 0");
        });

        context("when the song is created", async function () {
          it("should create a song", async function () {
            expect(await albums.getAlbumSongsCount(1)).to.equal(0);
            await albums.connect(owner).createSong(1, 1000, 100, "uri song");

            expect(await albums.getAlbumSongsCount(1)).to.equal(1);
            const song = await albums.getSong(1, 1);

            expect(song.id).to.equal(1);
            expect(song.price).to.equal(100);
            expect(song.maxSupply).to.equal(1000);
            expect(song.uri).to.equal("uri song");
          });

          it("should emit an ItemCreated event", async () => {
            expect(await albums.connect(owner).createSong(1, 1000, 100, "uri"))
              .to.emit(albums, "ItemCreated")
              .withArgs(owner.address, 1, 1000, 100, "uri song");
          });

          describe("mintSong", async function () {
            beforeEach(async function () {
              await albums.connect(owner).createSong(1, 1000, 100, "uri song");
            });

            it("should fail if songId does not exist", async function () {
              await expect(
                albums.connect(otherAccount1).mintSong(1, 0, { value: 100 })
              ).to.be.revertedWith("Song does not exist");
            });

            it("should fail if price is 0", async function () {
              await expect(
                albums.connect(otherAccount1).mintSong(1, 1)
              ).to.be.revertedWith("Invalid price");
            });

            context("when the song is minted", async function () {
              it("should mint a song", async function () {
                const tokenId = await albums.getTokenId(owner.address, 1, 1);

                expect(
                  await albums.balanceOf(otherAccount1.address, tokenId)
                ).to.equal(0);

                await albums
                  .connect(otherAccount1)
                  .mintSong(1, 1, { value: 100 });

                expect(
                  await albums.balanceOf(otherAccount1.address, tokenId)
                ).to.equal(1);
              });

              it("should emit an ItemMinted event", async () => {
                await expect(
                  albums.connect(otherAccount1).mintSong(1, 1, { value: 100 })
                )
                  .to.emit(albums, "ItemMinted")
                  .withArgs(owner.address, otherAccount1.address, 1, 1);
              });
            });
          });
        });
      });
    });
  });
});
