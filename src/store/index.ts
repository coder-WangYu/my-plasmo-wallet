import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DEFAULT_NETWORKS, type WalletState } from "../types/wallet"

interface walletStore extends WalletState {}

const initialState: WalletState = {
  isLocked: false,
  isConnected: false,
  accounts: [],
  currentAccount: null,
  mnemonic: null,
  password: null,
  currentNetwork: DEFAULT_NETWORKS[0],
  networks: DEFAULT_NETWORKS,
  tokens: []
}

export const useWalletStore = create<walletStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      
    }),
    {
      name: "wallet"
    }
  )
)
