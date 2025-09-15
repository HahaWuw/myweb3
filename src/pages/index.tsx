import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import Info from '../components/Info'
import ContractInfo from './contractInfo'
import BalanceChecker from './BalanceChecker';
import SendEthButton from './SendEthButton';
import TokenBalanceChecker from './TokenBalanceChecker';
import TransferListenerPage from './transferListener';
import EthersButton from './ethersButton';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectButton />
        <Info></Info>
        <ContractInfo></ContractInfo>
        {/* 使用 viem 连接以太坊主网，查询一个地址的余额 */}
        <BalanceChecker />
        {/* 使用 WalletClient 发送交易，发送 ETH 到另一个地址 */}
        <SendEthButton />
        {/* 调用一个 ERC-20 合约的 balanceOf 方法 */}
        <TokenBalanceChecker/>
        {/* 监听 ERC-20 合约的 Transfer 事件 */}
        <TransferListenerPage />
        {/* ethers调用合约读写方法 */}
        <EthersButton />
      </main>
    </div>
  );
};

export default Home;
