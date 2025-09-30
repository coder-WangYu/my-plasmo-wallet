import { MemoryRouter, Route, Routes } from "react-router-dom"

import { LoadingProvider } from "~contexts/LoadingContext"
import { MessageProvider } from "~contexts/MessageContext"

import AddToken from "./components/addToken"
import NetworkManager from "./components/networkManager"
import ReceiveToken from "./components/receiveToken"
import Search from "./components/search"
import SendToken from "./components/sendToken"
import SwapToken from "./components/swapToken"
import TokenManager from "./components/tokenManager"
import ViewHistory from "./components/viewHistory"
import WalletManager from "./components/walletManager"
import Index from "./pages/index"

function IndexPopup() {
  return (
    <LoadingProvider>
      <MessageProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/network-manager" element={<NetworkManager />} />
            <Route path="/wallet-manager" element={<WalletManager />} />
            <Route path="/token-manager" element={<TokenManager />} />
            <Route path="/add-token" element={<AddToken />} />
            <Route path="/send-token" element={<SendToken />} />
            <Route path="/receive-token" element={<ReceiveToken />} />
            <Route path="/swap-token" element={<SwapToken />} />
            <Route path="/view-history" element={<ViewHistory />} />
          </Routes>
        </MemoryRouter>
      </MessageProvider>
    </LoadingProvider>
  )
}

export default IndexPopup
