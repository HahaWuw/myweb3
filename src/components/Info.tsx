import { useAccount, useBalance } from 'wagmi'
import React from 'react'

const CONTRACT_ADDRESS = '0x496ca6cd43c1ee0ecb307179ae08fa80fd3c630f'

const Info = () => {
    const { address, isConnected } = useAccount()
    const { data, error } = useBalance({address})
   
    return (
        <>
            <div>------------------wagmi------------------</div>
            <div style={{marginTop: '20px'}}>address: {address}</div>
            <div>ETH Balance : {data?.formatted} {data?.symbol}</div>
            <div>Symbol: {data?.symbol}</div>
        </>
    )
}

export default Info