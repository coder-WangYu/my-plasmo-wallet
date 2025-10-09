import { useEffect, useState } from "react"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import { LoadingProvider } from "~contexts/LoadingContext"
import { MessageProvider } from "~contexts/MessageContext"
import { useWalletStore } from "~store"

import AddNetwork from "./components/addNetwork"
import AddToken from "./components/addToken"
import ConnectionConfirm from "./components/connectionConfirm"
import NetworkManager from "./components/networkManager"
import ReceiveToken from "./components/receiveToken"
import SaveMnemonic from "./components/saveMnemonic"
import Search from "./components/search"
import SendToken from "./components/sendToken"
import SendTokenDetail from "./components/sendTokenDetail"
import SwapToken from "./components/swapToken"
import TokenManager from "./components/tokenManager"
import ViewHistory from "./components/viewHistory"
import WalletManager from "./components/walletManager"
import Index from "./pages/index"
import Home from "~pages/home"
import Login from "~pages/login"

function IndexPopup() {
  const { ensureETHToken, ensureNetworks } = useWalletStore()
  const [connectionId, setConnectionId] = useState<string | null>(null)

  // 确保ETH代币始终存在
  useEffect(() => {
    ensureETHToken()
  }, [ensureETHToken])

  // 检查是否是连接确认请求
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const action = urlParams.get('action')
    
    console.log("Popup 加载，action:", action)
    
    if (action === 'connect') {
      console.log("进入连接确认模式")
      // 监听来自 background script 的连接请求
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("Popup 收到消息:", message)
        if (message.type === 'WALLET_CONNECTION_REQUEST') {
          console.log("收到连接请求，connectionId:", message.connectionId)
          setConnectionId(message.connectionId)
        }
      })
    }
  }, [])

  const handleConnectionApprove = (account: string) => {
    if (connectionId) {
      chrome.runtime.sendMessage({
        type: 'WALLET_CONNECTION_RESPONSE',
        connectionId: connectionId,
        approved: true,
        account: account
      })
    }
    window.close()
  }

  const handleConnectionReject = () => {
    if (connectionId) {
      chrome.runtime.sendMessage({
        type: 'WALLET_CONNECTION_RESPONSE',
        connectionId: connectionId,
        approved: false
      })
    }
    window.close()
  }

  // 如果是连接确认模式，显示连接确认组件
  if (connectionId) {
    return (
      <div className="w-full h-screen">
        <ConnectionConfirm
          connectionId={connectionId}
          onApprove={handleConnectionApprove}
          onReject={handleConnectionReject}
        />
      </div>
    )
  }

  // 确保默认网络始终存在
  useEffect(() => {
    ensureNetworks()
  }, [ensureNetworks])

  return (
    <LoadingProvider>
      <MessageProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/network-manager" element={<NetworkManager />} />
            <Route path="/add-network" element={<AddNetwork />} />
            <Route path="/wallet-manager" element={<WalletManager />} />
            <Route path="/token-manager" element={<TokenManager />} />
            <Route path="/add-token" element={<AddToken />} />
            <Route path="/send-token" element={<SendToken />} />
            <Route path="/send-token-detail" element={<SendTokenDetail />} />
            <Route path="/receive-token" element={<ReceiveToken />} />
            <Route path="/swap-token" element={<SwapToken />} />
            <Route path="/view-history" element={<ViewHistory />} />
            <Route path="/mnemonic" element={<SaveMnemonic />} />
          </Routes>
        </MemoryRouter>
      </MessageProvider>
    </LoadingProvider>
  )
}

export default IndexPopup
