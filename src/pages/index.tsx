import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import EthersButton from './ethersButton';

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectButton />
        <h1 className={styles.title}>
          Hi, web3
        </h1>
        <div className={styles.grid}>

          <div className={styles.card}>
            <h2>RainbowKit Documentation &rarr;</h2>
            <p>Learn how to use RainbowKit.</p>
            <p style={{'fontSize':'16px'}}>集成钱包多供应商</p>
          </div>

          <div className={styles.card}>
            <h2>wagmi Documentation &rarr;</h2>
            <p>Learn how to use Wagmi.</p>
            <p style={{'fontSize':'16px'}}>实现钱包连接基础功能</p>
            <button className={styles.coolbutton} style={{'color':'lightblue'}} onClick={() => router.push('/contractInfo')}>
            go
            </button>
          </div>

          <div
            className={styles.card}
          >
            <h2>viem Documentation &rarr;</h2>
            <p>Learn how to use viem.</p>
            <p style={{'fontSize':'16px'}}>调用钱包读写、监听、转账功能</p>
            <button className={styles.coolbutton} style={{'color':'rebeccapurple'}} onClick={() => router.push('/viemcontract')}>
            go
            </button>
          </div>

          <div className={styles.card} >
            <h2>ethers Documentation &rarr;</h2>
            <p>Learn how to use ethers.</p>
            <p style={{'fontSize':'16px'}}>调用钱包读写、监听、转账功能</p>
            <button className={styles.coolbutton} style={{'color':'lightseagreen'}} onClick={() => router.push('/ethersButton')}>
            go
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
