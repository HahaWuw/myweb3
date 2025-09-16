import { useAccount, useBalance, useReadContract } from 'wagmi'
import React from 'react'

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
  
  const { data: tokenBalance, error, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address, // ✅ v2 必须写在 query 里
    },
  })

  return (
    <div>
      <div>Wallet Address: {address}</div>
      <div>ETH Balance: {ethBalance?.formatted} {ethBalance?.symbol}</div>
      <div>Token Balance: {tokenBalance?.toString()}</div>
      {isLoading && <div>Loading token balance...</div>}
      {isError && <div>Error fetching token balance</div>}

      <div>------------------wagmi------------------</div>
    </div>
  )
}
