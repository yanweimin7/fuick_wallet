export type ChainType = "EVM" | "Solana";

export interface TokenConfig {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export interface ChainConfig {
  id: string;
  name: string;
  type: ChainType;
  chainId: number;
  rpcUrl: string | string[];
  explorer?: string;
  faucetUrl?: string;
  symbol?: string;
  tokens?: TokenConfig[];
  /** ChainIcons 中的图标 key，用于资产卡片/选链列表展示 */
  icon?: string;
  /** 是否为测试网，选链页会据此分组 */
  testnet?: boolean;
}

const CHAINS: ChainConfig[] = [
  {
    id: "eth-mainnet",
    name: "Ethereum Mainnet",
    type: "EVM",
    chainId: 1,
    rpcUrl: "https://ethereum.publicnode.com",
    explorer: "https://etherscan.io",
    symbol: "ETH",
    icon: "ethereum",
    tokens: [
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        decimals: 6,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        decimals: 6,
      },
    ],
  },
  {
    id: "arbitrum-one",
    name: "Arbitrum One",
    type: "EVM",
    chainId: 42161,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    symbol: "ETH",
    icon: "arbitrum",
    tokens: [
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
        decimals: 6,
      },
    ],
  },
  {
    id: "optimism-mainnet",
    name: "Optimism",
    type: "EVM",
    chainId: 10,
    rpcUrl: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io",
    symbol: "ETH",
    icon: "optimism",
    tokens: [
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
        decimals: 6,
      },
    ],
  },
  {
    id: "avalanche-c",
    name: "Avalanche C-Chain",
    type: "EVM",
    chainId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://snowtrace.io",
    symbol: "AVAX",
    icon: "avalanche",
    tokens: [
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0x9702230a8ea53601f5cd2dc00fdb89b070f87a1b",
        decimals: 6,
      },
    ],
  },
  {
    id: "base-mainnet",
    name: "Base",
    type: "EVM",
    chainId: 8453,
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    symbol: "ETH",
    icon: "base",
    tokens: [
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
        decimals: 6,
      },
    ],
  },
  {
    id: "linea-mainnet",
    name: "Linea",
    type: "EVM",
    chainId: 59144,
    rpcUrl: "https://rpc.linea.build",
    explorer: "https://lineascan.build",
    symbol: "ETH",
    icon: "linea",
    tokens: [
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xa219c472f33680876fd7c4740c8433c815188e08",
        decimals: 6,
      },
    ],
  },
  {
    id: "bsc-mainnet",
    name: "BNB Smart Chain",
    type: "EVM",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorer: "https://bscscan.com",
    symbol: "BNB",
    icon: "bsc",
    tokens: [
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0x55d398326f99059ff775485246999027b3197955",
        decimals: 18,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        decimals: 18,
      },
    ],
  },
  {
    id: "polygon-mainnet",
    name: "Polygon",
    type: "EVM",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
    symbol: "MATIC",
    icon: "polygon",
    tokens: [
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        decimals: 6,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        decimals: 6,
      },
    ],
  },
  {
    id: "solana-mainnet",
    name: "Solana",
    type: "Solana",
    chainId: 101,
    rpcUrl: "https://solana-rpc.publicnode.com",
    explorer: "https://solscan.io",
    symbol: "SOL",
    icon: "solana",
    tokens: [
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        decimals: 6,
      },
    ],
  },
  {
    id: "eth-sepolia",
    name: "Sepolia",
    type: "EVM",
    chainId: 11155111,
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    explorer: "https://sepolia.etherscan.io",
    faucetUrl: "https://sepolia-faucet.pk910.de/",
    symbol: "ETH",
    icon: "ethereum",
    testnet: true,
    tokens: [
      {
        symbol: "USDC",
        name: "Sepolia USDC",
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        decimals: 6,
      },
    ],
  },
  {
    id: "eth-holesky",
    name: "Holesky",
    type: "EVM",
    chainId: 17000,
    rpcUrl: "https://holesky.drpc.org",
    explorer: "https://holesky.etherscan.io",
    faucetUrl:
      "https://cloud.google.com/application/web3/faucet/ethereum/holesky",
    symbol: "ETH",
    icon: "ethereum",
    testnet: true,
    tokens: [],
  },
  {
    id: "arbitrum-sepolia",
    name: "Arbitrum Sepolia",
    type: "EVM",
    chainId: 421614,
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io",
    faucetUrl: "https://faucet.quicknode.com/arbitrum/sepolia",
    symbol: "ETH",
    icon: "arbitrum",
    testnet: true,
    tokens: [],
  },
  {
    id: "optimism-sepolia",
    name: "Optimism Sepolia",
    type: "EVM",
    chainId: 11155420,
    rpcUrl: "https://sepolia.optimism.io",
    explorer: "https://sepolia-optimistic.etherscan.io",
    faucetUrl: "https://faucet.quicknode.com/optimism/sepolia",
    symbol: "ETH",
    icon: "optimism",
    testnet: true,
    tokens: [],
  },
  {
    id: "solana-devnet",
    name: "Solana Devnet",
    type: "Solana",
    chainId: 103,
    rpcUrl: "https://solana-devnet.api.onfinality.io/public",
    explorer: "https://solscan.io?cluster=devnet",
    faucetUrl: "https://faucet.solana.com/",
    symbol: "SOL",
    icon: "solana",
    testnet: true,
    tokens: [],
  },
];

const SELECTED_KEY = "fuick_selected_chain";

export class ChainRegistry {
  static list(): ChainConfig[] {
    return CHAINS.slice();
  }

  static getById(id: string): ChainConfig | undefined {
    return CHAINS.find((c) => c.id === id);
  }

  static getDefault(): ChainConfig {
    return this.getById("eth-sepolia") || CHAINS[0];
  }
}

import { StorageService } from "./StorageService";

export async function getSelectedChain(): Promise<ChainConfig> {
  const saved = await StorageService.getItem(SELECTED_KEY);
  if (saved && saved.id) {
    const found = ChainRegistry.getById(saved.id);
    if (found) return found;
  }
  return ChainRegistry.getDefault();
}

export async function setSelectedChain(chain: ChainConfig): Promise<void> {
  await StorageService.setItem(SELECTED_KEY, { id: chain.id });
}
