"use client"; // 如果是 Next.js 13+（app dir）保留

import React, { useState } from "react";
import {
  createPublicClient,
  http,
  formatUnits,
  custom
} from "viem";
import { mainnet, sepolia } from "viem/chains";

/**
 * 最小 ERC-20 ABI（只包含我们需要的方法）
 */
const ERC20_ABI = [
  // balanceOf(address)
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ type: "address", name: "account" }],
    outputs: [{ type: "uint256", name: "" }],
  },
  // decimals()
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8", name: "" }],
  },
  // symbol()
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string", name: "" }],
  },
];

export default function TokenBalanceChecker() {
  const [chain, setChain] = useState("sepolia"); // "mainnet" or "sepolia"
  const [rpcUrl, setRpcUrl] = useState(""); // 可选：填你的 Alchemy/Infura RPC
  const [tokenAddress, setTokenAddress] = useState("0x496ca6cd43c1ee0ecb307179ae08fa80fd3c630f");
  const [targetAddress, setTargetAddress] = useState("0x5def82d23A4cB5AF793e7a1831B0e1b6356C9985");
  const [balance, setBalance] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getClient = () => {
    const selectedChain = chain === "mainnet" ? mainnet : sepolia;
    // 如果用户填了 RPC URL，优先使用；否则使用 viem 默认 http()（可能不稳定）
    const transport = rpcUrl ? http(rpcUrl) : http();
    return createPublicClient({
      chain: selectedChain,
      transport: custom(window.ethereum),
    });
  };

  const handleQuery = async () => {
    setError(null);
    setBalance(null);
    setSymbol("");
    if (!tokenAddress) {
      setError("请输入 ERC-20 合约地址");
      return;
    }
    if (!targetAddress) {
      setError("请输入要查询的地址");
      return;
    }

    setLoading(true);
    try {
      const client = getClient();

      // 1) 读取 decimals
      let decimals = 18; // 兜底
      try {
        const d = await client.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "decimals",
        });
        // viem 返回 BigInt 或 number 视情况而定，确保用 Number()
        decimals = Number(d);
      } catch (e) {
        // 如果合约没有 decimals（极少见），保留 18
        console.warn("读取 decimals 失败，使用默认 18", e);
      }

      // 2) 读取 symbol（可选）
      try {
        const s = await client.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "symbol",
        });
        setSymbol(String(s));
      } catch (e) {
        console.warn("读取 symbol 失败", e);
        setSymbol("");
      }

      // 3) 读取 balanceOf
      const rawBalance = await client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [targetAddress],
      });

      // rawBalance 是 BigInt（wei-like），用 formatUnits 转换
      const human = formatUnits(rawBalance, decimals);
      setBalance(human);
    } catch (err) {
      console.error(err);
      setError("查询失败（请检查地址、网络和 RPC）");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow space-y-4">
      <h3 className="text-xl font-semibold">调用ERC-20 balanceOf 方法</h3>

      {/* <div className="space-y-2">
        <label className="block text-sm">选择网络</label>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="sepolia">Sepolia (测试网)</option>
          <option value="mainnet">Mainnet (主网)</option>
        </select>
      </div> */}

      {/* <div className="space-y-2">
        <label className="block text-sm">可选 RPC（建议填 Alchemy / Infura / QuickNode URL）</label>
        <input
          placeholder="https://eth-mainnet.g.alchemy.com/v2/yourKey 或留空使用默认"
          value={rpcUrl}
          onChange={(e) => setRpcUrl(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div> */}

      <div className="space-y-2">
        <label className="block text-sm">ERC-20 合约地址</label>
        <input
          placeholder="0xTokenContractAddress"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">要查询的地址（wallet）</label>
        <input
          placeholder="0xUserAddress"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleQuery}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "查询中..." : "查询 balanceOf"}
        </button>
        <button
          onClick={() => {
            setTokenAddress("");
            setTargetAddress("");
            setBalance(null);
            setSymbol("");
            setError(null);
          }}
          className="px-3 py-2 border rounded"
        >
          清空
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {balance !== null && (
        <div className="mt-3">
          <p className="text-lg">
            余额: <strong>{balance}</strong> {symbol ? symbol : ""}
          </p>
          <p className="text-sm text-gray-500">（已根据 decimals 格式化）</p>
        </div>
      )}
    </div>
  );
}
