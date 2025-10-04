import * as bip39 from "bip39"
import CryptoJS, { AES, SHA256, enc } from "crypto-js"
import { ethers } from "ethers"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import type {
  Network,
  Token,
  TransactionHistory,
  WalletAccount
} from "~types/wallet"

import { DEFAULT_NETWORKS, type WalletState } from "../types/wallet"

// 默认ETH代币
const defaultETHToken: Token = {
  address: "0x0000000000000000000000000000000000000000", // ETH的零地址
  symbol: "ETH",
  name: "Ethereum",
  decimals: 18,
  type: "ETH",
  balance: "0.00"
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
  tokens: [defaultETHToken], // 默认包含ETH代币
  transactionHistory: []
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
  getWallet: () => ethers.Wallet | null
  lockWallet: () => void
  unlockWallet: (password: string) => void
  switchNetwork: (networkName: string) => void
  addToken: (token: Token) => void
  removeToken: (address: string) => void
  updateTokenBalance: (address: string, balance: string) => void
  updateTransactionHistory: (transactionHistory: TransactionHistory) => void
  ensureETHToken: () => void
  addNetwork: (network: Network) => void
  ensureNetworks: () => void
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

      // 创建wallet
      getWallet: () => {
        const state = get()
        const provider = state.getProvider()
        try {
          return new ethers.Wallet(state.currentAccount.privateKey, provider)
        } catch (error) {
          console.error("Failed to create wallet:", error)
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

      // 添加自定义网络
      addNetwork: (network: Network) => {
        set((state) => {
          const newNetwork = {
            ...network
          }
          return {
            networks: [...state.networks, newNetwork]
          }
        })
      },

      // 切换网络
      switchNetwork: (networkName: string) => {
        const state = get()
        const network = state.networks.find(
          (network) => network.name === networkName
        )
        if (network) {
          set({ currentNetwork: network })
        }
      },

      // 确保默认网络存在
      ensureNetworks: () => {
        set((state) => {
          if (!state.networks.length) {
            return {
              networks: [...DEFAULT_NETWORKS]
            }
          }

          return state
        })
      },

      // 添加代币
      addToken: (token: Token) => {
        set((state) => ({
          tokens: [
            ...state.tokens.filter((t) => t.address !== token.address),
            token
          ]
        }))
      },

      // 删除代币
      removeToken: (address: string) => {
        // 不允许删除默认的ETH代币
        if (address === "0x0000000000000000000000000000000000000000") {
          return
        }
        set((state) => ({
          tokens: state.tokens.filter((token) => token.address !== address)
        }))
      },

      // 更新代币余额
      updateTokenBalance: (address: string, balance: string) => {
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.address === address ? { ...token, balance } : token
          )
        }))
      },

      // 确保ETH代币存在
      ensureETHToken: () => {
        set((state) => {
          const hasETHToken = state.tokens.some(
            (token) =>
              token.address === "0x0000000000000000000000000000000000000000"
          )

          if (!hasETHToken) {
            return {
              tokens: [defaultETHToken, ...state.tokens]
            }
          }

          return state
        })
      },

      // 更新交易历史
      updateTransactionHistory: (transactionHistory: TransactionHistory) => {
        set((state) => ({
          transactionHistory: [...state.transactionHistory, transactionHistory]
        }))
      },

      // 钱包连接
      // connect: async (): Promise<WalletAccount> => {
      //   const state = await new Promise<WalletState | null>((resolve) => {
      //     chrome.storage.local.get("wallet-store", (result) => {
      //       console.log("钱包信息:", result["wallet-store"])
      //       resolve(result["wallet-store"]?.state || null)
      //     })
      //   })

      //   if (!state || !state.currentAccount) {
      //     throw new Error("请先在插件中导入账户")
      //   }
      //   console.log(state)
      //   console.log(state.currentAccount)

      //   const account = state.currentAccount as WalletAccount
      //   set({
      //     currentAccount: account,
      //     isConnected: true
      //   })

      //   return account
      // },

      // 签名消息
      // signMessage: async (message) => {
      //   const { state } = JSON.parse(localStorage.getItem("wallet-store"))
      //   console.log("钱包信息:", state)
      //   const account = state.currentAccount
      //   if (!account) {
      //     throw new Error("未连接钱包")
      //   }
      //   const bytes = AES.decrypt(account.privateKey, state.password)
      //   const privateKey = bytes.toString(enc.Utf8)

      //   const wallet = new ethers.Wallet(privateKey)
      //   return wallet.signMessage(message)
      // },

      // 钱包断开连接
      // disconnect: () => {
      //   set({ currentAccount: null, isConnected: false })
      // }
    }),
    {
      name: "DyWallet",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 确保ETH代币始终存在
          const hasETHToken = state.tokens.some(
            (token) =>
              token.address === "0x0000000000000000000000000000000000000000"
          )

          if (!hasETHToken) {
            state.tokens.unshift(defaultETHToken)
          }

          // 确保默认网络始终存在
          if (!state.networks.length) {
            state.networks.unshift(...DEFAULT_NETWORKS)
          }
        }
      }
    }
  )
)

// 开发环境暴露到 window
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).walletStore = useWalletStore
}
