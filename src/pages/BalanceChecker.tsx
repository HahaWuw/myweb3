"use client"; // 如果你用的是 Next.js 13+ 要加这一行

import React, { useState } from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http() 
  // 这里最好换成 Infura/Alchemy 的主网 RPChttps://eth-mainnet.g.alchemy.com/v2/你的API_KEY
});

export default function BalanceChecker() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckBalance = async () => {
    try {
      setLoading(true);
      const result = await client.getBalance({ address: '0x5def82d23A4cB5AF793e7a1831B0e1b6356C9985' });
      const eth = Number(result) / 1e18; // wei → ETH
      setBalance(eth.toFixed(6));
    } catch (error) {
      console.error(error);
    //   setBalance("查询失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">ETH 余额查询</h1>
      <input
        type="text"
        placeholder="输入以太坊地址"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleCheckBalance}
        disabled={loading || !address}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "查询中..." : "查询余额"}
      </button>
      {balance !== null && (
        <p className="text-lg">余额: {balance} ETH</p>
      )}
    </div>
  );
}
