import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style.css"

const TokenManager = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleBack = () => {
    navigate(-1)
  }

  const handleAddToken = () => {
    navigate("/add-token")
  }

  const handleRemoveToken = (tokenName: string) => {
    console.log(`移除代币: ${tokenName}`)
  }

  const handleAddPopularToken = (tokenName: string) => {
    console.log(`添加热门代币: ${tokenName}`)
  }

  const addedTokens = [
    {
      name: "OCB",
      icon: "🟣",
      description: "0x3ec451...2947300a",
      hasBitcoinOverlay: true
    },
    {
      name: "USDT",
      icon: "🟢",
      description: "Tether USD",
      hasBitcoinOverlay: true
    },
    {
      name: "ETH",
      icon: "🔵",
      description: "Ethereum",
      hasBitcoinOverlay: true
    },
    {
      name: "BNB",
      icon: "⚫",
      description: "BNB",
      hasBitcoinOverlay: true
    }
  ]

  const popularTokens = [
    {
      name: "GT",
      icon: "🔵",
      description: "GateToken"
    },
    {
      name: "WLD",
      icon: "⚪",
      description: "0x163f8c...60318753"
    }
  ]

  const filteredAddedTokens = addedTokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPopularTokens = popularTokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
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
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">币种管理</h1>
        <button className="p-1 rounded hover:bg-gray-100 transition-colors">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
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
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* 添加代币 */}
        <div
          onClick={handleAddToken}
          className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-gray-900">添加代币</span>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* 已添加币种 */}
        <div className="py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">已添加币种</h2>
          {filteredAddedTokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
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
                  <div className="text-sm text-gray-500">{token.description}</div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveToken(token.name)}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* 热门代币 */}
        <div className="py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">热门代币</h2>
          {filteredPopularTokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {token.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{token.name}</div>
                  <div className="text-sm text-gray-500">{token.description}</div>
                </div>
              </div>
              <button
                onClick={() => handleAddPopularToken(token.name)}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TokenManager
