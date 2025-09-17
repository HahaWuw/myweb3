'use client'

import { useState } from 'react'
import { useAccount, useWatchContractEvent } from 'wagmi'

// ERC20 Transfer 事件 ABI
const erc20Abi = [
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
]

export default function TransferWatcher() {
  const { address } = useAccount()
  const [isWatching, setIsWatching] = useState(false)

  // 只有 isWatching = true 时才会订阅事件
  useWatchContractEvent(
    isWatching
      ? {
          address: '0xYourTokenAddress', // 替换成你的 Token 合约地址
          abi: erc20Abi,
          eventName: 'Transfer',
          args: { to: address }, // 只监听转给当前用户的
          onLogs: (logs) => {
            logs.forEach((log) => {
              console.log('📢 收到转账事件:', log.args)
            })
          },
        }
      : undefined // 传 undefined 就不会监听
  )

  return (
    <div className="p-4">
      {address ? <p>当前钱包: {address}</p> : <p>请先连接钱包</p>}

      <div className="mt-4 flex gap-4">
        {!isWatching ? (
          <button
            onClick={() => setIsWatching(true)}
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            🚀 开始监听
          </button>
        ) : (
          <button
            onClick={() => setIsWatching(false)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            🛑 停止监听
          </button>
        )}
      </div>
    </div>
  )
}
