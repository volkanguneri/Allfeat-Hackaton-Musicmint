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
    <main className="flex justify-center items-center flex-col mb-60 gap-8">
      <form
        id="artistForm"
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
