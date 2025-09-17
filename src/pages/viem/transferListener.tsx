import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";

export default function TransferListenerPage() {
  const { data: walletClient } = useWalletClient();
  const [events, setEvents] = useState<any[]>([]);

  // ERC-20 合约地址 (换成你自己的代币地址)
  const tokenAddress = "0x496ca6cd43c1ee0ecb307179ae08fa80fd3c630f";
  const abi = [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ];

  useEffect(() => {
    if (!walletClient) return;

    const run = async () => {
      // viem 的 walletClient → ethers provider
      const provider = new ethers.BrowserProvider(walletClient.transport);

      // 合约实例（只读即可）
      const contract = new ethers.Contract(tokenAddress, abi, provider);

      // 监听 Transfer
      contract.on("Transfer", (from, to, value, event) => {
        const formatted = {
          from,
          to,
          value: ethers.formatUnits(value, 18), // 假设代币 18 位精度
          txHash: event.transactionHash,
        };

        // 添加到事件列表
        setEvents((prev) => [formatted, ...prev]);
      });
    };

    run();

    // 卸载时移除监听，防止内存泄漏
    return () => {
      if (walletClient) {
        const provider = new ethers.BrowserProvider(walletClient.transport);
        const contract = new ethers.Contract(tokenAddress, abi, provider);
        contract.removeAllListeners("Transfer");
      }
    };
  }, [walletClient]);

  return (
    <main style={{ padding: "20px" }}>
      <h3>ERC-20 Transfer 事件监听(实时事件日志)</h3>
      {events.length === 0 && <p>暂无事件，试试转账代币触发</p>}
      <ul>
        {events.map((e, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            <strong>From:</strong> {e.from} <br />
            <strong>To:</strong> {e.to} <br />
            <strong>Value:</strong> {e.value} <br />
            <strong>Tx:</strong>{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${e.txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {e.txHash}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
