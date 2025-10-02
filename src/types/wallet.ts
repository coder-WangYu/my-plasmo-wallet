export interface WalletAccount {
  address: string
  privateKey: string
  name: string
  index: number
}

export interface Network {
  id: string
  name: string
  rpcUrl: string
  chainId: number
  symbol: string
  blockExplorerUrl?: string
  isMainnet?: boolean
}

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  type: "ERC20" | "ERC721" | "ERC1155" | "ETH"
  balance?: string
  tokenId?: string
  image?: string
}

export interface WalletState {
  isLocked: boolean
  isConnected: boolean
  accounts: WalletAccount[]
  currentAccount: WalletAccount | null
  mnemonic: string | null
  password: string | null
  currentNetwork: Network
  networks: Network[]
  tokens: Token[]
}

// 默认网络
export const DEFAULT_NETWORKS: Network[] = [
  {
    id: 'sepolia',
    name: 'Ethereum Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/bd53db44b045458e827701c6bc02a161',
    chainId: 11155111,
    symbol: 'ETH',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    isMainnet: false,
  },
  {
    id: 'mainnet',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/bd53db44b045458e827701c6bc02a161',
    chainId: 11155111,
    symbol: 'ETH',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    isMainnet: true,
  },
];

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)"
]

export const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)"
]