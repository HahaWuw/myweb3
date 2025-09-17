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
        tokenAddress="0x496ca6cd43c1ee0ecb307179ae08fa80fd3c630f"
        rpcUrl="https://eth-mainnet.g.alchemy.com/v2/RZMNlxQLB6s5mXe0rVElF"
        decimals={18}
      />
    </div>
  )
}
