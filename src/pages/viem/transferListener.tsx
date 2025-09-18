'use client'

import { useState, useEffect } from "react"
import { createPublicClient, createWalletClient, custom, http, parseUnits } from "viem"
import { sepolia } from "viem/chains"
import erc20Abi from "./erc20Abi.json" // ERC-20 ABI，只要 transfer, balanceOf, decimals, Transfer

export default function TokenTransfer() {
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [txHash, setTxHash] = useState("")
  const [transferLogs, setTransferLogs] = useState<string[]>([])

  // 1️⃣ 连接钱包
  const walletClient = typeof window !== "undefined" 
    ? createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
        account: address
      })
    : null

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http("https://eth-sepolia.g.alchemy.com/v2/RZMNlxQLB6s5mXe0rVElF")
  })

  const tokenAddress = "0xc8731481ddd213e81e77a00cb16b5a499a9f63be"

  // 2️⃣ 获取钱包地址
  useEffect(() => {
    async function fetchAddress() {
      if (walletClient) {
        const accounts = await walletClient.request({ method: "eth_requestAccounts" })
        setAddress(accounts[0])
      }
    }
    fetchAddress()
  }, [walletClient])

  // 3️⃣ 获取 token 余额
  useEffect(() => {
    async function fetchBalance() {
      if (address && publicClient) {
        const decimals = await publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "decimals",
        })
        const bal = await publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        })
        setBalance((Number(bal) / 10 ** Number(decimals)).toString())
      }
    }
    fetchBalance()
  }, [address, publicClient])

  // 4️⃣ 转账按钮点击
  const handleTransfer = async () => {
    if (!walletClient) return
    try{
        const amount = parseUnits("1", 18) // 1 token，18 decimals
        const tx = await walletClient.writeContract({
          abi: erc20Abi,
          address: tokenAddress,
          functionName: "transfer",
          args: [address, amount],
        })
        setTxHash(tx.hash)
        console.log("交易发送成功:", tx.hash)
        alert('✅ 转账请求已发送，请在钱包确认。')
    }catch(error){
      if (error?.message?.includes('User rejected')) {
        alert('❌ 用户拒绝了交易。')
      } else {
        alert(`⚠️ 发生错误: ${error.message}`)
      }
    }
    
  }

  // 5️⃣ 监听 Transfer 事件
  useEffect(() => {
    if (!publicClient) return
    const filter = publicClient.createEventFilter({
      abi: erc20Abi,
      address: tokenAddress,
      eventName: "Transfer",
    })

    const unsubscribe = publicClient.watchEvent({
      filter,
      onLogs: (logs) => {
        logs.forEach((log) => {
          const from = log.args.from
          const to = log.args.to
          const value = log.args.value
          setTransferLogs((prev) => [
            `Transfer: ${from} -> ${to} : ${Number(value) / 10 ** 18}`,
            ...prev,
          ])
        })
      },
    })

    return () => unsubscribe()
  }, [publicClient])

  return (
    <div>
      <h3>监听ERC-20 transfer方法</h3>
      {/* <h2>钱包地址: {address}</h2>
      <h3>余额: {balance}</h3> */}
      <button onClick={handleTransfer}>发送 1 token</button>
      {txHash && <p>交易哈希: {txHash}</p>}
      <h4>Transfer 事件日志:</h4>
      <ul>
        {transferLogs.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  )
}
