import * as bip39 from "bip39"
import { AES, SHA256 } from "crypto-js"
import { ethers } from "ethers"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { WalletAccount } from "~types/wallet"

import { DEFAULT_NETWORKS, type WalletState } from "../types/wallet"

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

interface walletStore extends WalletState {
  createWallet: (
    password: string
  ) => Promise<{ mnemonic: string; account: WalletAccount }>
  importWallet: (mnemonic: string, password: string) => Promise<WalletAccount>
  isValidPassword: (password: string) => boolean
  importPrivateKey: (
    privateKey: string,
    password: string,
    name?: string
  ) => Promise<WalletAccount>
  getProvider: () => ethers.JsonRpcProvider | null
  lockWallet: () => void
  unlockWallet: (password: string) => void
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

        const seedBuffer = await bip39.mnemonicToSeed(mnemonic) // await
        const seed = new Uint8Array(seedBuffer)
        const hdNode = ethers.HDNodeWallet.fromSeed(seed) // 这里能访问到是因为前面的await
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

      // 导入私钥
      importPrivateKey: async (
        privateKey: string,
        password: string,
        name = "Private Account"
      ) => {
        try {
          // console.log(ethers) 这里确实访问不到ethers模块
          const wallet = new ethers.Wallet(privateKey)
          const existingAccounts = get().accounts

          const account: WalletAccount = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            name,
            index: existingAccounts.length
          }

          const encryptedPrivateKey = AES.encrypt(
            wallet.privateKey,
            password
          ).toString()

          set((state) => ({
            accounts: [
              ...state.accounts,
              { ...account, privateKey: encryptedPrivateKey }
            ],
            currentAccount: account,
            password: state.password || SHA256(password).toString()
          }))

          return account
        } catch (error) {
          throw new Error("Invalid private key")
        }
      },

      // 验证密码
      isValidPassword: (password: string) => {
        const state = get()
        const hashedPassword = SHA256(password).toString()
        return state.password === hashedPassword
      },

      // 创建provider
      getProvider: () => {
        const state = get()
        try {
          return new ethers.JsonRpcProvider(state.currentNetwork.rpcUrl)
        } catch (error) {
          console.error("Failed to create provider:", error)
          return null
        }
      },

      // 锁定钱包
      lockWallet: () => {
        set({ isLocked: true })
      },

      // 解锁钱包
      unlockWallet: (password: string) => {
        const state = get()
        const hashedPassword = SHA256(password).toString()
        if (state.password !== hashedPassword) {
          throw new Error("Invalid password")
        }
        set({ isLocked: false })
      },

      
    }),
    {
      name: "wallet"
    }
  )
)

// 开发环境暴露到 window
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).walletStore = useWalletStore
}
