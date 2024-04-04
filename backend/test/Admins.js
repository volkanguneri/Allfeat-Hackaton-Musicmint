const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Admins", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let admins;

  beforeEach(async function () {
    const Admins = await ethers.getContractFactory("Admins");
   
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    admins = await Admins.deploy(owner.address);
    //adminsAdd = admins.target;


  });

  describe("Deployment", function () {
    it("Should add an owner", async function () {
      expect(await admins.owner()).to.equal(owner.address);
    });
  });

  describe("add_admin", function () {

    it("Should not be used without super privilegies", async function () {
      await expect(admins.connect(addr1).add_admin(addr2.address, addr2.address)).to.be.revertedWith("not super admin");
    });

    it("Should not downgrade a super admin", async function () {
      await expect(admins.add_admin(owner.address, owner.address)).to.be.revertedWith("role already set");
    });

    it("Should fail if admin already exists", async function () {
      await admins.add_admin(addr1.address, addr1.address);
      await expect(admins.add_admin(addr1.address, addr1.address)).to.be.revertedWith("role already set");
    });

    it("Should setup admins", async function () {
      await admins.add_admin(addr1.address, addr1.address);
      await expect( await admins.admins(addr1.address)).to.equal(1);
      await expect( await admins.admins_contracts(addr1.address)).to.equal(addr1.address);
       // todo : fix with the deployed contract
    });



  });

   // describe("Events", function () {
   //   it("Should emit an event on addAdmin", async function () {
      //   await expect(lock.withdraw())
      //     .to.emit(lock, "Withdrawal")
      //     .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
     //  });
   // });

    // describe("Transfers", function () {
    //   it("Should transfer the funds to the owner", async function () {
    //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //       deployOneYearLockFixture
    //     );

    //     await time.increaseTo(unlockTime);

    //     await expect(lock.withdraw()).to.changeEtherBalances(
    //       [owner, lock],
    //       [lockedAmount, -lockedAmount]
    //     );
    //   });
    // });
});
