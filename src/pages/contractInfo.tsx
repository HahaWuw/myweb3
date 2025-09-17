import { useAccount, useBalance, useReadContract, useWatchContractEvent, useWriteContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import React from 'react'
import { parseEther, parseUnits, erc20Abi } from 'viem'
import TransferWatcher from '../components/TransferWagmi' 

const ercwatch20Abi = [
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  }
]

const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
]

const CONTRACT_ADDRESS = '0x496ca6cd43c1ee0ecb307179ae08fa80fd3c630f'

export default function ContractInfo() {
  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({ address })

  const { data: hash, sendTransaction } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isOk} = useWaitForTransactionReceipt({ hash })

  const { data: hashWrite, writeContract } = useWriteContract()
  const { isLoading: iswriteConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  
  const { data: error, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address, // ✅ v2 必须写在 query 里
    },
  })

  return (
    <div style={{'padding': '20px'}}>
      <p style={{color: 'lightcoral'}}>wagmi连接钱包/读取余额/发送交易/调用合约balanceof方法/监听合约的transfer事件</p>
      <div>钱包地址（Wallet Address）: <span style={{color: 'lightblue'}}>{ address ? address:'请稍侯...' }</span></div>
      <div>读取余额（ETH Balance）: <span style={{color: 'rebeccapurple'}}>{ethBalance?.formatted} {ethBalance?.symbol}</span></div>
      {/* <div>Token Balance: {tokenBalance?.toString()}</div>
      {isLoading && <div>Loading token balance...</div>}
      {isError && <div>Error fetching token balance</div>} */}

      <div>发送交易（转账transfer）：
        <button
          onClick={() =>
            sendTransaction({
              to: address, // 接收方地址
              value: parseEther('0.01'),   // 转账 0.01 ETH
            })
          }
        >
          发送 0.01 ETH
        </button>
        {isConfirming && <div>交易确认中...</div>}
        {isSuccess && <div>交易成功 ✅ hash: {hash}</div>}
      </div>
      <div>调用合约balanceof方法：
        <button
          onClick={() =>
            writeContract({
              address: CONTRACT_ADDRESS,
              abi: erc20Abi,
              functionName: 'transfer',
              args: ['0xRecipientAddressHere', parseUnits('10', 18)], // 转 10 个 token
            })
          }
        >
          转账 10 Token
        </button>
        {isLoading && <div>交易确认中...</div>}
        {isSuccess && <div>交易成功 ✅ hash: {hash}</div>}
      </div>
      <div>监听合约的transfer事件：
      {address ? (
        <p>正在监听 {address} 的转账事件...</p>
      ) : (
        <p>请先连接钱包</p>
      )}

      <TransferWatcher />
      </div>
    </div>
  )
}
