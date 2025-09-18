'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import EthersDemo from '../components/EthersDemo'

export default function HomePage() {
  return (
    <div className="p-4" style={{'padding': '20px'}}>
      <div className="flex justify-end mb-4">
        {/* <ConnectButton /> */}
      </div>

      <EthersDemo
        tokenAddress="0xc8731481ddd213e81e77a00cb16b5a499a9f63be"
        rpcUrl="https://eth-sepolia.g.alchemy.com/v2/RZMNlxQLB6s5mXe0rVElF"
        decimals={18}
      />
    </div>
  )
}
