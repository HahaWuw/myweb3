'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

interface EthersDemoProps {
  tokenAddress: `0x${string}`
  rpcUrl: string
  decimals?: number
}

export default function EthersDemo({ tokenAddress, rpcUrl, decimals = 18 }: EthersDemoProps) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [userAddress, setUserAddress] = useState<string>('')
  const [ethBalance, setEthBalance] = useState<string>('0')
  const [tokenBalance, setTokenBalance] = useState<string>('0')
  const [logs, setLogs] = useState<string[]>([])

  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ]

  // 连接钱包
  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("请安装 MetaMask")
      return
    }

    const _provider = new ethers.BrowserProvider((window as any).ethereum)
    const _signer = await _provider.getSigner()
    const address = await _signer.getAddress()

    setProvider(_provider)
    setSigner(_signer)
    setUserAddress(address)
  }

  // 获取 ETH 余额
  const fetchEthBalance = async () => {
    if (!provider || !userAddress) return
    const balance = await provider.getBalance(userAddress)
    setEthBalance(ethers.formatEther(balance))
  }

  // 获取 Token 余额
  const fetchTokenBalance = async () => {
    if (!provider || !userAddress) return
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider)
    const bal = await contract.balanceOf(userAddress)
    setTokenBalance(ethers.formatUnits(bal, decimals))
  }

  // 发送 ETH
  const sendEth = async () => {
    if (!signer) return
    const tx = await signer.sendTransaction({
      to: userAddress, // 示例: 发给自己
      value: ethers.parseEther("0.001")
    })
    console.log("交易已发送:", tx)
    await tx.wait()
    console.log("交易确认完成")
    fetchEthBalance()
  }

  // 监听 Transfer
  useEffect(() => {
    if (!provider || !userAddress) return

    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider)
    const onTransfer = (from: string, to: string, value: ethers.BigNumberish) => {
      if (from.toLowerCase() === userAddress.toLowerCase() || to.toLowerCase() === userAddress.toLowerCase()) {
        const valStr = ethers.formatUnits(value, decimals)
        setLogs(prev => [`${from} → ${to} : ${valStr}`, ...prev])
        fetchTokenBalance()
      }
    }

    contract.on("Transfer", onTransfer)
    return () => {
      contract.off("Transfer", onTransfer)
    }
  }, [provider, userAddress, tokenAddress, decimals])

  // 初始获取余额
  useEffect(() => {
    if (provider && userAddress) {
      fetchEthBalance()
      fetchTokenBalance()
    }
  }, [provider, userAddress])

  return (
    <div className="p-4 max-w-lg mx-auto border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Ethers Demo</h2>
      <button onClick={connectWallet} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        连接钱包
      </button>

      {userAddress && (
        <div>
          <p>地址: {userAddress}</p>
          <p>ETH 余额: {ethBalance}</p>
          <p>Token 余额: {tokenBalance}</p>
          <button onClick={sendEth} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mt-2">
            发送 0.001 ETH 给自己
          </button>
        </div>
      )}

      <div>
        <h3 className="font-semibold">最新 Transfer 事件</h3>
        <div className="max-h-48 overflow-y-auto border p-2 rounded bg-gray-50">
          {logs.length === 0 ? <p className="text-gray-400">暂无事件</p> :
            <ul className="space-y-1">{logs.map((log, idx) => <li key={idx}>{log}</li>)}</ul>}
        </div>
      </div>
    </div>
  )
}
