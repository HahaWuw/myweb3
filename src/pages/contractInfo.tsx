
// import { useAccount, useBalance, useReadContract } from 'wagmi'
// import React from 'react'

// const ERC20_ABI = [
//   {
//     type: 'function',
//     name: 'balanceOf',
//     stateMutability: 'view',
//     inputs: [{ name: 'account', type: 'address' }],
//     outputs: [{ type: 'uint256' }],
//   },
// ]

// const CONTRACT_ADDRESS = '0xaE036c65C649172b43ef7156b009c6221B596B8b'

// export default function contractInfo() {
//     const { address, isConnected } = useAccount()
//     const { data, error } = useBalance({address})
//     const result = useReadContract({
//         abi: ERC20_ABI,
//         address: CONTRACT_ADDRESS,
//         functionName: 'balanceOf',
//         args: [address],
//         query: {enabled: isConnected}
//     })

//     console.log(result)
    
//     return (
//         <>
//             {/* <div>{ result }</div> */}
//             <div>{ address }</div>
//         </>
//     )
// }



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

const CONTRACT_ADDRESS = '0xaE036c65C649172b43ef7156b009c6221B596B8b'

export default function ContractInfo() {
  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  
  const { data: tokenBalance, error,isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address, // ✅ v2 必须写在 query 里
    },
  })
  console.log("Token balance error:", error)


  return (
    <div>
      <div>Wallet Address: {address}</div>
      <div>ETH Balance: {ethBalance?.value}</div>
      <div>Token Balance: {tokenBalance?.toString()}</div>
      {isLoading && <div>Loading token balance...</div>}
      {isError && <div>Error fetching token balance</div>}
    </div>
  )
}
