import { useAccount, useBalance, useReadContract, useWriteContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import React from 'react'
import { parseEther, parseUnits, erc20Abi } from 'viem'

const CONTRACT_ADDRESS = '0xc8731481ddd213e81e77a00cb16b5a499a9f63be'

export default function ContractInfo() {
  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({ address })

  const { data: hash, sendTransaction } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isOk} = useWaitForTransactionReceipt({ hash })
  
  const {data: balance, error, status} = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address, // ✅ v2 必须写在 query 里
    },
  })

  const { data: decimals } = useReadContract({
    abi: erc20Abi,
    address: CONTRACT_ADDRESS,
    functionName: "decimals",
  })

  const formattedBalance =
  balance && decimals ? Number(balance) / 10 ** Number(decimals) : 0;

  // const { data: hashWrite, writeContract } = useWriteContract()
  // const { isLoading: iswriteConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const { writeContract, isPending, data, error: writeError } = useWriteContract()

  const handleTransfer = async () => {
    await writeContract({
      abi: erc20Abi,
      address: CONTRACT_ADDRESS,  // ERC-20 合约地址
      functionName: "transfer",
      args: [address, BigInt(10000000000000000)], // 1.5 token (18 decimals)
    })
    console.log(isPending, data, writeError)
  }
  return (
    <div style={{'padding': '20px'}}>
      <p style={{color: 'lightcoral'}}>wagmi连接钱包/读取余额/发送交易/调用合约balanceof方法/监听合约的transfer事件</p>
      <div>钱包地址（Wallet Address）: <span style={{color: 'lightblue'}}>{ address ? address:'请稍侯...' }</span></div>
      <div>读取余额（ETH Balance）: <span style={{color: 'rebeccapurple'}}>{ethBalance?.formatted} {ethBalance?.symbol}</span></div>
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
        {isOk && <div>交易成功 ✅ hash: {hash}</div>}
        {hash &&  <a 
              href={`https://sepolia.etherscan.io/tx/${hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline"
            >
              查看交易
            </a>}
      </div>
      <hr />
      <div>调用合约balanceof方法：
        <div>链上钱包balance： {status != 'success' ? '请稍候' : formattedBalance}</div>
        <div>合约gas值{balance}-decimals：{decimals}</div>
        {error && <span style={{color: 'red'}}>报错啦{error}</span>}
      </div>
      <hr />
    
      <div>监听合约的transfer事件：
        {/* <TransferWatcher /> */}
        <button onClick={handleTransfer} disabled={isPending}>
          {isPending ? "交易中..." : "Transfer 1.5 TOKEN"}
        </button>
        {data && <p>交易哈希: {data.hash}</p>}
        {writeError && <p style={{ color: "red" }}>错误: {writeError.message}</p>}
      </div>
    </div>
  )
}
