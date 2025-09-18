import { useAccount, useBalance } from 'wagmi'
import React from 'react'

const CONTRACT_ADDRESS = '0xc8731481ddd213e81e77a00cb16b5a499a9f63be'

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