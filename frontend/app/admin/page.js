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

const admin = () => {
  return (
    <main className="flex justify-center items-center flex-col mb-80">
      <form id="artistForm" className="flex justify-center items-center gap-4">
        <label for="artistName" className="text-2xl">
          Artist:
        </label>
        <input
          type="text"
          id="artistName"
          name="artistName"
          className="p-1"
          required
        />
        <button
          type="submit"
          className="bg-[#cef54b] text-[#15141a] rounded p-1"
        >
          Ajouter
        </button>
      </form>
    </main>
  );
};

export default admin;
