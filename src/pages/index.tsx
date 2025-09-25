import { useEffect, useRef, useState } from "react"

import "../style.css"

const Index = () => {
  const [activeTab, setActiveTab] = useState("代币")
  const [copied, setCopied] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState("Ethereum")
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const walletAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  const networks = [
    { name: "Ethereum", icon: "🔵", chainId: 1 },
    { name: "BSC", icon: "🟡", chainId: 56 },
    { name: "Polygon", icon: "🟣", chainId: 137 },
    { name: "Arbitrum", icon: "🔵", chainId: 42161 }
  ]

  const handleNetworkSelect = (networkName: string) => {
    setCurrentNetwork(networkName)
    setShowNetworkDropdown(false)
  }

  const toggleNetworkDropdown = () => {
    setShowNetworkDropdown(!showNetworkDropdown)
  }

  const handleWalletSwitch = () => {
    // TODO: 跳转到切换钱包页面
    console.log("跳转到切换钱包页面")
  }

  // 点击外部关闭下拉列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNetworkDropdown(false)
      }
    }

    if (showNetworkDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNetworkDropdown])

  const assets = [
    {
      name: "OCB",
      icon: "🟣",
      price: "$2.69",
      change: "-88.97%",
      changeType: "down",
      amount: "40.93",
      value: "$110.25"
    },
    {
      name: "USDT",
      icon: "🟢",
      price: "$0.9869",
      change: "0.00%",
      changeType: "neutral",
      amount: "0",
      value: "$0.00"
    },
    {
      name: "ETH",
      icon: "🔵",
      price: "$4,059.67",
      change: "-3.14%",
      changeType: "down",
      amount: "0",
      value: "$0.00"
    },
    {
      name: "BNB",
      icon: "🟡",
      price: "$1,196.06",
      change: "-2.45%",
      changeType: "down",
      amount: "0",
      value: "$0.00"
    }
  ]

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></div>
          <div className="flex-1">
            <div className="text-sm font-medium px-2 text-gray-800">
              DyWallet
            </div>
            <button
              onClick={handleWalletSwitch}
              className="text-xs text-gray-500 flex items-center hover:bg-gray-100 hover:text-gray-700 rounded px-2 py-1 transition-colors duration-200 cursor-pointer"
              title="点击切换钱包">
              <span className="font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyAddress()
                }}
                className={`ml-1 p-1 rounded transition-colors ${
                  copied
                    ? "text-green-500 bg-green-50"
                    : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                }`}
                title={copied ? "已复制!" : "复制地址"}>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="搜索">
            <svg
              className="w-5 h-5 text-gray-500 hover:text-blue-500"
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
          </button>
          <button
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="设置">
            <svg
              className="w-5 h-5 text-gray-500 hover:text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleNetworkDropdown}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title={`当前网络: ${currentNetwork} (点击选择)`}>
              <svg
                className="w-5 h-5 text-gray-500 hover:text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
            </button>

            {/* 网络选择下拉列表 */}
            {showNetworkDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-700">
                    切换网络
                  </div>
                </div>
                <div className="py-2">
                  {networks.map((network) => (
                    <button
                      key={network.name}
                      onClick={() => handleNetworkSelect(network.name)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                        currentNetwork === network.name
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}>
                      <span className="text-lg">{network.icon}</span>
                      <div>
                        <div className="font-medium">{network.name}</div>
                        <div className="text-xs text-gray-500">
                          Chain ID: {network.chainId}
                        </div>
                      </div>
                      {currentNetwork === network.name && (
                        <svg
                          className="w-4 h-4 ml-auto text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 余额显示区域 */}
      <div className="px-4 py-1">
        <div className="text-3xl font-bold text-gray-800">$110.25</div>
        <div className="flex items-center space-x-2 text-sm mt-1">
          <span className="text-red-500">-$0.01 (-0.00%) 1D</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-around px-6 py-2">
        {[
          { name: "发送", icon: "↑" },
          { name: "接收", icon: "↓" },
          { name: "兑换", icon: "⇄" },
          { name: "历史", icon: "📄" },
          { name: "更多", icon: "⋯" }
        ].map((item, index) => (
          <button
            key={index}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200 cursor-pointer group">
            <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-2 transition-colors duration-200">
              <span className="text-lg group-hover:text-blue-600 transition-colors duration-200">
                {item.icon}
              </span>
            </div>
            <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {/* 资产标签页 */}
      <div className="px-6 py-1">
        <div className="flex space-x-6 border-b border-gray-100">
          {["代币", "NFT", "授权"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 资产列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-2">
        {activeTab === "代币" ? (
          assets.map((asset, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    {asset.name}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">₿</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{asset.name}</div>
                  <div className="text-sm text-gray-500">{asset.price}</div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm font-medium ${
                    asset.changeType === "down"
                      ? "text-red-500"
                      : asset.changeType === "up"
                        ? "text-green-500"
                        : "text-gray-500"
                  }`}>
                  {asset.change}
                </div>
                <div className="text-sm text-gray-500">{asset.amount}</div>
                <div className="text-sm font-medium text-gray-800">
                  {asset.value}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20">
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

      {/* 底部浮动按钮 */}
      {activeTab === "代币" && (
        <div className="py-3 px-10">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>币种管理</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Index
