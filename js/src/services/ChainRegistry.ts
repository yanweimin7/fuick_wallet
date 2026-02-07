export type ChainType = 'EVM' | 'Solana';

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
  rpcUrl: string;
  explorer?: string;
  faucetUrl?: string;
  symbol?: string;
  tokens?: TokenConfig[];
}

const CHAINS: ChainConfig[] = [
  {
    id: 'eth-mainnet',
    name: 'Ethereum Mainnet',
    type: 'EVM',
    chainId: 1,
    rpcUrl: 'https://rpc.ankr.com/eth',
    explorer: 'https://etherscan.io',
    symbol: 'ETH',
    tokens: [
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        decimals: 6,
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6,
      },
    ],
  },
  {
    id: 'eth-sepolia',
    name: 'Sepolia',
    type: 'EVM',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.drpc.org',
    explorer: 'https://sepolia.etherscan.io',
    faucetUrl: 'https://sepolia-faucet.pk910.de/',
    symbol: 'ETH',
    tokens: [
      {
        symbol: 'USDC',
        name: 'Sepolia USDC',
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        decimals: 6,
      },
    ],
  },
  {
    id: 'eth-holesky',
    name: 'Holesky',
    type: 'EVM',
    chainId: 17000,
    rpcUrl: 'https://rpc.ankr.com/eth_holesky',
    explorer: 'https://holesky.etherscan.io',
    faucetUrl: 'https://cloud.google.com/application/web3/faucet/ethereum/holesky',
    symbol: 'ETH',
    tokens: [],
  },
  {
    id: 'base-mainnet',
    name: 'Base',
    type: 'EVM',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    symbol: 'ETH',
    tokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2',
        decimals: 6,
      },
    ],
  },
  {
    id: 'linea-mainnet',
    name: 'Linea',
    type: 'EVM',
    chainId: 59144,
    rpcUrl: 'https://rpc.linea.build',
    explorer: 'https://lineascan.build',
    symbol: 'ETH',
    tokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xa219c472f33680876fd7c4740c8433c815188e08',
        decimals: 6,
      },
    ],
  },
  {
    id: 'bsc-mainnet',
    name: 'BNB Smart Chain',
    type: 'EVM',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    symbol: 'BNB',
    tokens: [
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0x55d398326f99059ff775485246999027b3197955',
        decimals: 18,
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        decimals: 18,
      },
    ],
  },
  {
    id: 'polygon-mainnet',
    name: 'Polygon',
    type: 'EVM',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    symbol: 'MATIC',
    tokens: [
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        decimals: 6,
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        decimals: 6,
      },
    ],
  },
  {
    id: 'solana-mainnet',
    name: 'Solana',
    type: 'Solana',
    chainId: 101,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
    symbol: 'SOL',
    tokens: [],
  },
  {
    id: 'solana-devnet',
    name: 'Solana Devnet',
    type: 'Solana',
    chainId: 103,
    rpcUrl: 'https://api.devnet.solana.com',
    explorer: 'https://solscan.io?cluster=devnet',
    symbol: 'SOL',
    tokens: [],
  },
];

const SELECTED_KEY = 'fuick_selected_chain';

export class ChainRegistry {
  static list(): ChainConfig[] {
    return CHAINS.slice();
  }

  static getById(id: string): ChainConfig | undefined {
    return CHAINS.find((c) => c.id === id);
  }

  static getDefault(): ChainConfig {
    return this.getById('eth-sepolia') || CHAINS[0];
  }
}

import { StorageService } from './StorageService';

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
