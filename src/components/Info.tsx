import { useAccount, useBalance } from 'wagmi'
import React from 'react'

const CONTRACT_ADDRESS = '0xcD6a42782d230D7c13A74ddec5dD140e55499Df9'

const Info = () => {
    const { address, isConnected } = useAccount()
    const { data, error } = useBalance({address})
   
    return (
        <>
            <div style={{marginTop: '20px'}}>address: {address}</div>
            <div>ETH Balance : {data?.value}</div>
            <div>Symbol: {data?.symbol}</div>
        </>
    )
}

export default Info