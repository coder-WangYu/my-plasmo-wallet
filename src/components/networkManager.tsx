import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../style.css"

import { useWalletStore } from "~store"
import { DEFAULT_NETWORKS } from "~types/wallet"
import { useLoading } from "~contexts/LoadingContext"
import { useMessage } from "~contexts/MessageContext"

const NetworkManager = () => {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const { success, error } = useMessage()
  const { currentNetwork, switchNetwork } = useWalletStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("主网络")

  const handleBack = () => {
    navigate(-1)
  }

  const handleAddNetwork = () => {
    // TODO: 添加自定义网络
  }

  const handleNetworkSelected = async (networkName: string) => {
    if (!currentNetwork) return

    setLoading(true, "切换网络中...")
    try {
      await switchNetwork(networkName)
      navigate("/home")
    } catch {
      error("切换网络失败")
    } finally {
      setLoading(false)
    }
  }

  const mainnetNetworks = DEFAULT_NETWORKS.filter(
    (network) => network.isMainnet
  )
  const testnetNetworks = DEFAULT_NETWORKS.filter(
    (network) => !network.isMainnet
  )

  // 根据当前 tab 选择对应的网络列表
  const currentNetworks =
    activeTab === "主网络" ? mainnetNetworks : testnetNetworks

  // 根据搜索关键词过滤当前网络列表
  const filteredNetworks = currentNetworks.filter((network) =>
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
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">
          网络管理
        </h1>
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
            { name: "测试网络", isActive: false }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-2 text-sm font-medium relative ${
                activeTab === tab.name ? "text-blue-600" : "text-gray-500"
              }`}>
              {tab.name}
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 网络列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          {filteredNetworks.map((network, index) => {
            const isCurrentNetwork = currentNetwork?.name === network.name
            return (
            <div
              onClick={isCurrentNetwork ? undefined : () => handleNetworkSelected(network.name)}
              key={index}
              className={`flex items-center justify-between py-3 border-b border-gray-100 transition-colors ${
                isCurrentNetwork 
                  ? 'cursor-default bg-blue-50' 
                  : 'cursor-pointer hover:bg-gray-50'
              }`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  🟡
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 mb-1">
                    {network.name}
                  </div>
                  <div className="font-medium text-gray-800 mb-1">
                    {network.chainId}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isCurrentNetwork && (
                  <div className="text-xs text-blue-600 font-medium">
                    当前网络
                  </div>
                )}
                <svg
                  className={`w-5 h-5 ${
                    isCurrentNetwork ? 'text-blue-400' : 'text-gray-400'
                  }`}
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
            )
          })}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={handleAddNetwork}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
          <svg
            className="w-5 h-5"
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
          <span>添加自定义网络</span>
        </button>
      </div>
    </div>
  )
}

export default NetworkManager
