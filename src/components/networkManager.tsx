import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style.css"

const NetworkManager = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("主网络")

  const handleBack = () => {
    navigate(-1)
  }

  const handleAddNetwork = () => {
    console.log("添加自定义网络")
  }

  const networks = [
    {
      name: "Ethereum",
      icon: "💎",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "0G Chain",
      icon: "🟣",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "PLAYA3ULL GAMES",
      icon: "🟢",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "Abstract",
      icon: "🟢",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "Acala",
      icon: "🩷",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "Endurance Smart Chain",
      icon: "🟠",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "AlienX",
      icon: "👽",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "BSC",
      icon: "🟡",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "Polygon",
      icon: "🟣",
      tag: "EVM",
      isMainnet: true
    },
    {
      name: "Arbitrum",
      icon: "🔵",
      tag: "EVM",
      isMainnet: true
    }
  ]

  const filteredNetworks = networks.filter(network =>
    network.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">选择网络</h1>
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
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 标签页 */}
      <div className="px-4 pb-2">
        <div className="flex space-x-6 border-b border-gray-100">
          {[
            { name: "主网络", isActive: true },
            { name: "测试网络", isActive: false },
            { name: "自定义网络", isActive: false }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-2 text-sm font-medium relative ${
                activeTab === tab.name
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}>
              {tab.name}
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 全部网络标题 */}
      <div className="px-4 py-3 bg-blue-50">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
            />
          </svg>
          <span className="text-sm font-medium text-blue-600">
            全部网络({filteredNetworks.length})
          </span>
        </div>
      </div>

      {/* 网络列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          {filteredNetworks.map((network, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  {network.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{network.name}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full">
                      {network.tag}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {network.isMainnet && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                )}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NetworkManager
