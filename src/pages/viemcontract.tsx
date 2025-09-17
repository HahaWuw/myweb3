import BalanceChecker from './viem/BalanceChecker';
import SendEthButton from './viem/SendEthButton';
import TokenBalanceChecker from './viem/TokenBalanceChecker';
import TransferListenerPage from './viem/transferListener';

export default function ContractInfo() {
    return (
        <div style={{'padding': '20px'}}>
            <p style={{color: 'rebeccapurple'}}>viem连接钱包/读取余额/发送交易/调用合约balanceof方法/监听合约的transfer事件</p>
            <BalanceChecker />
            {/* 使用 WalletClient 发送交易，发送 ETH 到另一个地址 */}
            <SendEthButton />
            {/* 调用一个 ERC-20 合约的 balanceOf 方法 */}
            <TokenBalanceChecker/>
            {/* 监听 ERC-20 合约的 Transfer 事件 */}
            <TransferListenerPage />
        </div>
    )
}