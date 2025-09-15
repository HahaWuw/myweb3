"use client"; // 如果是 Next.js 13+ 要加

import React, { useState } from "react";
import { createWalletClient, custom, parseEther } from "viem";
import { sepolia } from "viem/chains"; // 你可以改成 mainnet


export default function SendEthButton() {
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState(null);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. 创建 WalletClient，连接 MetaMask
      const walletClient = createWalletClient({
        chain: sepolia, // 这里换成 mainnet 就能发主网交易
        transport: custom(window.ethereum),
      });

      // 2. 请求授权获取账号
      const [account] = await walletClient.requestAddresses();

      // 3. 发送交易（转 0.01 ETH 给指定地址）
      const txHash = await walletClient.sendTransaction({
        account,
        to: "0x5def82d23A4cB5AF793e7a1831B0e1b6356C9985", // ⚠️ 换成接收方地址
        value: parseEther("0.01"),   // 转 0.01 ETH
      });

      setHash(txHash);
    } catch (err) {
      console.error(err);
      setError("交易失败，请检查控制台日志");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md space-y-2">
      <button
        onClick={handleSend}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "发送中..." : "发送 0.01 ETH"}
      </button>

      {hash && (
        <p className="text-green-600">
          ✅ 交易已提交： 
          <a 
            href={`https://sepolia.etherscan.io/tx/${hash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline"
          >
            查看交易
          </a>
        </p>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
