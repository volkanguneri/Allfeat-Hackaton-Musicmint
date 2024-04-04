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

  describe("addAdmin", function () {

    it("Should not be used without super privilegies", async function () {
      await expect(admins.connect(addr1).addAdmin(addr2.address, addr2.address)).to.be.revertedWith("not super admin");
    });

    it("Should not downgrade a super admin", async function () {
      await expect(admins.addAdmin(owner.address, owner.address)).to.be.revertedWith("role already set");
    });

    it("Should fail if admin already exists", async function () {
      await admins.addAdmin(addr1.address, addr1.address);
      await expect(admins.addAdmin(addr1.address, addr1.address)).to.be.revertedWith("role already set");
    });

    it("Should setup adminRoles and adminsContracts", async function () {
      await admins.addAdmin(addr1.address, addr1.address);
      await expect( await admins.adminRoles(addr1.address)).to.equal(1);
      await expect( await admins.adminsContracts(addr1.address)).to.equal(addr1.address);
       // todo : fix with the deployed contract
    });

  });

  describe("addSuperAdmin", function () {

    it("Should not be used without super privilegies", async function () {
      await expect(admins.connect(addr1).addSuperAdmin(addr2.address)).to.be.reverted;
    });

    it("Should fail if superadmin already exists", async function () {
      await admins.addSuperAdmin(addr1.address);
      await expect(admins.addSuperAdmin(addr1.address)).to.be.reverted;
    });

    it("Should setup adminRoles", async function () {
      await admins.addSuperAdmin(addr1.address);
      await expect( await admins.adminRoles(addr1.address)).to.equal(2);
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
