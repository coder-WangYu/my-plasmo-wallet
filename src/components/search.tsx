import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style.css"

const Search = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("全部")

  const handleBack = () => {
    navigate(-1)
  }

  const assets = [
    {
      name: "OCB",
      chain: "BNB Smart Chain",
      address: "0x3ec451....2947300a",
      icon: "🟣",
      amount: "40.93",
      value: "$110.25"
    },
    {
      name: "USDT",
      chain: "多链",
      description: "Tether USD",
      icon: "🟢",
      amount: "0",
      value: "$0.00"
    },
    {
      name: "ETH",
      chain: "多链",
      description: "Ethereum",
      icon: "🔵",
      amount: "0",
      value: "$0.00"
    },
    {
      name: "BNB",
      chain: "多链",
      description: "BNB",
      icon: "⚫",
      amount: "0",
      value: "$0.00"
    }
  ]

  const filteredAssets = activeTab === "全部" 
    ? assets 
    : activeTab === "代币" 
    ? assets 
    : []

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
        <h1 className="text-lg font-semibold text-gray-800">搜索</h1>
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
            placeholder="搜索"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 标签页 */}
      <div className="px-4 pb-2">
        <div className="flex space-x-6 border-b border-gray-100">
          {[
            { name: "全部", count: 4 },
            { name: "代币", count: 4 },
            { name: "NFT", count: 0 }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-2 text-sm font-medium relative ${
                activeTab === tab.name
                  ? "text-gray-800"
                  : "text-gray-500"
              }`}>
              {tab.name}({tab.count})
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 代币列表 */}
        <div className="px-4 py-2">
          <div className="text-sm font-medium text-gray-600 mb-3">代币({filteredAssets.length})</div>
          
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                      {asset.icon}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">₿</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">{asset.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full">
                        {asset.chain}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {asset.address || asset.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-800">{asset.amount}</div>
                  <div className="text-sm text-gray-500">{asset.value}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div className="text-gray-500 text-sm">暂无数据</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
