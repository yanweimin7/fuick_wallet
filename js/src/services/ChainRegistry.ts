export type ChainType = 'EVM' | 'Solana';

export interface ChainConfig {
  id: string;
  name: string;
  type: ChainType;
  chainId: number;
  rpcUrl: string;
  explorer?: string;
  symbol?: string;
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
  },
  {
    id: 'eth-sepolia',
    name: 'Sepolia',
    type: 'EVM',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.drpc.org',
    explorer: 'https://sepolia.etherscan.io',
    symbol: 'ETH',
  },
  {
    id: 'bsc-mainnet',
    name: 'BNB Smart Chain',
    type: 'EVM',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    symbol: 'BNB',
  },
  {
    id: 'polygon-mainnet',
    name: 'Polygon',
    type: 'EVM',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    symbol: 'MATIC',
  },
  {
    id: 'solana-mainnet',
    name: 'Solana',
    type: 'Solana',
    chainId: 101,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
    symbol: 'SOL',
  },
  {
    id: 'solana-devnet',
    name: 'Solana Devnet',
    type: 'Solana',
    chainId: 103,
    rpcUrl: 'https://api.devnet.solana.com',
    explorer: 'https://solscan.io?cluster=devnet',
    symbol: 'SOL',
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
