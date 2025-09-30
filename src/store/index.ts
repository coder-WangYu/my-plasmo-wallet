import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as bip39 from "bip39"
import { ethers } from "ethers"
import { AES, SHA256 } from "crypto-js"
import type { WalletAccount } from "~types/wallet"
import { DEFAULT_NETWORKS, type WalletState } from "../types/wallet"

interface walletStore extends WalletState {
  createWallet: (password: string) => Promise<{ mnemonic: string, account: WalletAccount }>
  importWallet: (mnemonic: string, password: string) => Promise<WalletAccount>
}

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
      
      // 创建钱包
      createWallet: async (password: string) => {
        // 生成助记词
        const mnemonic = bip39.generateMnemonic()
        // 生成种子
        const seedBuffer = await bip39.mnemonicToSeed(mnemonic)
        // 转成 Uint8Array
        const seed = new Uint8Array(seedBuffer)
        console.log(mnemonic)
        console.log(seedBuffer)
        console.log(seed)

        // 生成钱包
        const hdNode = ethers.HDNodeWallet.fromSeed(seed)
        // 生成账户
        const wallet = hdNode.derivePath("m/44'/60'/0'/0/0")

        const account: WalletAccount = {
          address: wallet.address,
          privateKey: wallet.privateKey,
          name: "Account 1",
          index: 0
        }

        // 加密敏感数据
        const encryptedMnemonic = AES.encrypt(mnemonic, password).toString()
        const encryptedPrivateKey = AES.encrypt(
          wallet.privateKey,
          password
        ).toString()

        set({
          isLocked: false,
          accounts: [{ ...account, privateKey: encryptedPrivateKey }],
          currentAccount: account,
          mnemonic: encryptedMnemonic,
          password: SHA256(password).toString()
        })

        return { mnemonic, account }
      },

      // 导入助记词
      importWallet: async (mnemonic: string, password: string) => {
        if (!bip39.validateMnemonic(mnemonic)) {
          throw new Error("Invalid mnemonic phrase")
        }

        const seedBuffer = await bip39.mnemonicToSeed(mnemonic)
        const seed = new Uint8Array(seedBuffer)
        const hdNode = ethers.HDNodeWallet.fromSeed(seed)
        const wallet = hdNode.derivePath("m/44'/60'/0'/0/0")

        const account: WalletAccount = {
          address: wallet.address,
          privateKey: wallet.privateKey,
          name: "Account 1",
          index: 0
        }

        const encryptedMnemonic = AES.encrypt(mnemonic, password).toString()
        const encryptedPrivateKey = AES.encrypt(
          wallet.privateKey,
          password
        ).toString()

        set({
          isLocked: false,
          accounts: [{ ...account, privateKey: encryptedPrivateKey }],
          currentAccount: account,
          mnemonic: encryptedMnemonic,
          password: SHA256(password).toString()
        })

        return account
      },
    }),
    {
      name: "wallet"
    }
  )
)

// 开发环境暴露到 window
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).walletStore = useWalletStore;
}