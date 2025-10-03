import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style.css"

const ReceiveToken = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleBack = () => {
    navigate(-1)
  }

  const handleTokenSelect = (tokenName: string) => {
    console.log(`选择代币: ${tokenName}`)
    // TODO: 跳转到接收详情页面
  }

  const tokens = [
    {
      name: "OCB",
      fullName: "OneCoinBuy",
      icon: "🟣",
      amount: "40.93",
      value: "$110.25",
      hasBitcoinOverlay: true
    },
    {
      name: "USDT",
      fullName: "Tether USD",
      icon: "🟢",
      amount: "0",
      value: "$0.00",
      hasBitcoinOverlay: true
    },
    {
      name: "ETH",
      fullName: "Ethereum",
      icon: "🔵",
      amount: "0",
      value: "$0.00",
      hasBitcoinOverlay: true
    },
    {
      name: "BNB",
      fullName: "BNB",
      icon: "⚫",
      amount: "0",
      value: "$0.00",
      hasBitcoinOverlay: true
    }
  ]

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="p-1 rounded hover:bg-gray-100 transition-colors">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">选择币种</h1>
        <div className="w-8"></div>
      </div>

      {/* 搜索框 */}
      <div className="px-4 py-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索代币或合约地址"
            className={`w-full py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${
              searchQuery ? "pl-10 pr-12" : "pl-10 pr-4"
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 代币列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          {filteredTokens.map((token, index) => (
            <div
              key={index}
              onClick={() => handleTokenSelect(token.name)}
              className="flex items-center justify-between py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {token.icon}
                  </div>
                  {token.hasBitcoinOverlay && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">₿</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{token.name}</div>
                  <div className="text-sm text-gray-500">{token.fullName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-800">{token.amount}</div>
                <div className="text-sm text-gray-500">{token.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReceiveToken
