"use client";

// ReactJs
import { useEffect, useState } from "react";

// Toastify
import { ToastContainer, toast } from "react-toastify";

// Wagmi
import { prepareWriteContract, writeContract } from "@wagmi/core";

// Viem
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { hardhat } from "viem/chains";

// Contract's information
import { AdminsABI, contractAddressAdmins } from "@/constants/index";

const admin = () => {
  // Admin Information

  const [superAdmin, setSuperAdmin] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [grantedEvents, setGrantedEvents] = useState([]);

  // Event handling function
  const getGrantedEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddressAdmins,
        event: parseAbiItem(
          "event Granted (address from, address to, Role role,address contractt);"
        ),
        fromBlock: 0n,
        toBlock: "latest",
      });

      setGrantedEvents(logs.map((log) => log.args.from));
      toast.success("Admin Created");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const createSuperAdmin = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddressAdmins,
        abi: AdminsABI,
        functionName: "addSuperAdmin",
        args: [_addr],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });

      getGrantedEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <main className="flex justify-center items-center flex-col mb-60 gap-8">
      <form
        id="adminForm"
        className="flex justify-center items-center flex-col gap-4"
      >
        <label for="admin" className="text-2xl">
          Admin
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            id="artistName"
            name="artistName"
            className="text-[#15141a] p-1 rounded"
            required
          />
          <button
            type="submit"
            className="bg-[#cef54b] text-[#15141a] rounded p-1"
            onClick={createSuperAdmin}
          >
            Submit
          </button>
        </div>
      </form>

      <form
        id="artistForm"
        className="flex justify-center items-center flex-col gap-4"
      >
        <label for="artist" className="text-2xl">
          Artist
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            id="artistName"
            name="artistName"
            className="text-[#15141a] p-1 rounded"
            required
          />
          <button
            type="submit"
            className="bg-[#cef54b] text-[#15141a] rounded p-1"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
};

export default admin;
