import { useAccount, useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function EethersButton() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [ethBalance, setEthBalance] = useState<string>("");
  const [tokenBalance, setTokenBalance] = useState<string>("");

  // ERC-20 合约配置
  const tokenAddress = "0x496ca6cd43c1ee0ecb307179ae08fa80fd3c630f"; // 换成你要交互的 ERC-20 地址
  const tokenAbi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  useEffect(() => {
    const load = async () => {
      if (!walletClient || !isConnected) return;

      // viem walletClient → ethers provider
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();

      // ETH 余额
      const balance = await provider.getBalance(address!);
      setEthBalance(ethers.formatEther(balance));

      // 代币余额
      const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      const bal = await contract.balanceOf(address);
      setTokenBalance(`${ethers.formatUnits(bal, decimals)} ${symbol}`);
    };

    load();
  }, [walletClient, isConnected, address]);

  // 转账方法
  const transferToken = async () => {
    if (!walletClient) return;

    const provider = new ethers.BrowserProvider(walletClient.transport);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const decimals = await contract.decimals();
    const amount = ethers.parseUnits("1", decimals); // 转账 1 个代币

    const to = prompt("请输入接收地址:");
    if (!to) return;

    const tx = await contract.transfer(to, amount);
    alert(`交易发送中: ${tx.hash}`);
    await tx.wait();
    alert("✅ 转账完成！");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>RainbowKit + ethers.js Demo</h1>
      {isConnected && (
        <>
          <p>钱包地址: {address}</p>
          <p>ETH 余额: {ethBalance}</p>
          <p>Token 余额: {tokenBalance}</p>
          <button onClick={transferToken}>转账 1 Token</button>
        </>
      )}
    </main>
  );
}