import { useState } from "react"
import { Routes, Route, MemoryRouter } from "react-router-dom"
import Login from "./pages/login"
import Index from "./pages/index"
import Search from "./components/search"
import NetworkManager from "./components/networkManager"
import WalletManager from "./components/walletManager"
import TokenManager from "./components/tokenManager"
import AddToken from "./components/addToken"
import Sign from "./pages/sign"
import SendToken from "./components/sendToken"
import ReceiveToken from "./components/receiveToken"
import SwapToken from "./components/swapToken"
import ViewHistory from "./components/viewHistory"

function IndexPopup() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/login" element={<Login />} />
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
  )
}

export default IndexPopup
