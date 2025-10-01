import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import "../style.css"

import { useMessage } from "~contexts/MessageContext"
import { useWalletStore } from "~store"
import { useGetBalance } from "~hooks/useGetBalance"

const Index = () => {
  const navigate = useNavigate()
  const { isValidPassword, currentAccount, mnemonic } = useWalletStore()
  const { error, warning } = useMessage()
  const { ethBalance } = useGetBalance()
  const [activeTab, setActiveTab] = useState("代币")
  const [copied, setCopied] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState("Ethereum")
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [showMoreDrawer, setShowMoreDrawer] = useState(false)
  const [showNestedDrawer, setShowNestedDrawer] = useState(false)
  const [nestedDrawerTitle, setNestedDrawerTitle] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [sensitiveData, setSensitiveData] = useState("")
  const [copiedSensitive, setCopiedSensitive] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const settingsDropdownRef = useRef<HTMLDivElement>(null)

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
    setShowSettingsDropdown(false)
  }

  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown(!showSettingsDropdown)
    setShowNetworkDropdown(false)
  }

  const handleSettingsSelect = (option: string) => {
    setShowSettingsDropdown(false)

    switch (option) {
      case "钱包管理":
        navigate("/wallet-manager")
        break
      case "网络管理":
        navigate("/network-manager")
        break
      case "更改密码":
        console.log("跳转到更改密码页面")
        break
      default:
        console.log(`选择了设置选项: ${option}`)
    }
  }

  const handleWalletSwitch = () => {
    // TODO: 跳转到切换钱包页面
    console.log("跳转到切换钱包页面")
  }

  const handleSearch = () => {
    navigate("/search")
  }

  const handleTokenManagement = () => {
    navigate("/token-manager")
  }

  const handleSendToken = () => {
    navigate("/send-token")
  }

  const handleReceiveToken = () => {
    navigate("/receive-token")
  }

  const handleSwapToken = () => {
    navigate("/swap-token")
  }

  const handleViewHistory = () => {
    navigate("/view-history")
  }

  const handleMoreClick = () => {
    setShowMoreDrawer(true)
  }

  const handleCloseMoreDrawer = () => {
    setShowMoreDrawer(false)
  }

  const handleAccountDetailClick = (action: string) => {
    if (action === "查看私钥") {
      setNestedDrawerTitle("私钥")
      setShowNestedDrawer(true)
    } else if (action === "查看助记词") {
      setNestedDrawerTitle("私钥助记词")
      setShowNestedDrawer(true)
    } else {
      // setShowMoreDrawer(false)
      warning(`暂未开发的操作: ${action}`)
      // TODO: 实现具体功能
    }
  }

  const handleCloseNestedDrawer = () => {
    setShowNestedDrawer(false)
    setPassword("")
    setIsPasswordVerified(false)
    setSensitiveData("")
    setCopiedSensitive(false)
  }

  const handleConfirmPassword = () => {
    if (password.trim()) {
      if (isValidPassword(password)) {
        setIsPasswordVerified(true)
        if (nestedDrawerTitle === "私钥") {
          setSensitiveData(currentAccount?.privateKey)
        } else if (nestedDrawerTitle === "私钥助记词") {
          setSensitiveData(mnemonic)
        }
      } else {
        error("密码错误，请重试")
      }
    }
  }

  const handleCopySensitiveData = async () => {
    try {
      await navigator.clipboard.writeText(sensitiveData)
      setCopiedSensitive(true)
      setTimeout(() => setCopiedSensitive(false), 2000)
    } catch (err) {
      console.error("复制失败:", err)
    }
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
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSettingsDropdown(false)
      }
    }

    if (showNetworkDropdown || showSettingsDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNetworkDropdown, showSettingsDropdown])

  const assets = [
    {
      name: "OCB",
      icon: "🟣",
      price: "$2.69",
      change: "-88.97%",
      changeType: "down",
      amount: "40.93",
      value: "$110.25"
    }
  ]

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">
              {currentAccount?.name}
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <span className="font-mono">
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </span>
              <button
                onClick={() => navigate("/wallet-manager")}
                className="ml-1 p-1 rounded transition-colors cursor-pointer text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                title="切换钱包">
                <svg
                  className="w-3 h-3"
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
              </button>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyAddress()
                }}
                className={`ml-1 p-1 rounded transition-colors cursor-pointer ${
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
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSearch}
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
          <div className="relative" ref={settingsDropdownRef}>
            <button
              onClick={toggleSettingsDropdown}
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

            {/* 设置下拉列表 */}
            {showSettingsDropdown && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-700">设置</div>
                </div>
                <div className="py-2">
                  {[
                    { name: "钱包管理", icon: "👛" },
                    { name: "网络管理", icon: "🌐" },
                    { name: "更改密码", icon: "🔒" }
                  ].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSettingsSelect(option.name)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700">
                      <span className="text-base">{option.icon}</span>
                      <span className="text-sm">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-800 flex items-baseline">
              {ethBalance.split("").map((char, index) => (
                <span
                  key={index}
                  className="animate-fade-in-up inline-block"
                  style={{ animationDelay: `${index * 0.05}s` }}>
                  {char}
                </span>
              ))}
              <span className="ml-1">ETH</span>
            </div>
            <div className="flex items-center space-x-2 text-sm mt-1">
              <span className="text-red-500">-$0.01 (-0.00%) 1D</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">
              {currentNetwork}
            </span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-around px-6 py-2">
        {[
          { name: "发送", icon: "↑", onClick: handleSendToken },
          { name: "接收", icon: "↓", onClick: handleReceiveToken },
          { name: "兑换", icon: "⇄", onClick: handleSwapToken },
          { name: "历史", icon: "📄", onClick: handleViewHistory },
          { name: "更多", icon: "⋯", onClick: handleMoreClick }
        ].map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
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
          <button
            onClick={handleTokenManagement}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
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

      {/* 账户详情抽屉 */}
      {showMoreDrawer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-end"
          onClick={handleCloseMoreDrawer}>
          <div
            className="w-full bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">test</h2>
              <button
                onClick={handleCloseMoreDrawer}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <svg
                  className="w-6 h-6 text-gray-500"
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
            </div>

            {/* 用户头像 */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white font-bold">T</span>
              </div>
            </div>

            {/* 账户信息列表 */}
            <div className="space-y-1 mb-6">
              <button
                onClick={() => handleAccountDetailClick("编辑账户名称")}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm text-gray-600">账户名称</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-800">
                    {currentAccount?.name}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => handleAccountDetailClick("查看地址详情")}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm text-gray-600">地址</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-800">
                    {currentAccount.address.slice(0, 6)}...
                    {currentAccount.address.slice(-4)}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500"
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
              </button>

              <button
                onClick={() => handleAccountDetailClick("钱包详情")}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm text-gray-600">钱包</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-800">
                    {currentAccount?.name}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500"
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
              </button>
            </div>

            {/* 安全选项 */}
            <div className="space-y-1">
              <button
                onClick={() => handleAccountDetailClick("查看助记词")}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm text-gray-600">私钥助记词</span>
                <svg
                  className="w-4 h-4 text-gray-500"
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
              </button>

              <button
                onClick={() => handleAccountDetailClick("查看私钥")}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm text-gray-600">私钥</span>
                <svg
                  className="w-4 h-4 text-gray-500"
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
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 嵌套抽屉 - 私钥/助记词 */}
      {showNestedDrawer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end"
          onClick={handleCloseNestedDrawer}>
          <div
            className="w-full bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {nestedDrawerTitle}
              </h2>
              <button
                onClick={handleCloseNestedDrawer}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <svg
                  className="w-6 h-6 text-gray-500"
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
            </div>

            {!isPasswordVerified ? (
              <>
                {/* 密码输入区域 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    输入您的密码
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="密码"
                    className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* 警告提示 */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-red-700">
                        警告:切勿泄露此{nestedDrawerTitle}。任何拥有您
                        {nestedDrawerTitle}
                        的人都可以窃取您账户中持有的任何资产。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 按钮区域 */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseNestedDrawer}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                    取消
                  </button>
                  <button
                    onClick={handleConfirmPassword}
                    disabled={!password.trim()}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                      password.trim()
                        ? "bg-gray-600 text-white hover:bg-gray-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}>
                    确认
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 敏感数据显示区域 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {nestedDrawerTitle}
                  </label>
                  <div className="relative">
                    <textarea
                      value={sensitiveData}
                      readOnly
                      rows={nestedDrawerTitle === "私钥助记词" ? 3 : 2}
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 resize-none"
                    />
                    <button
                      onClick={handleCopySensitiveData}
                      className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${
                        copiedSensitive
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}>
                      {copiedSensitive ? (
                        <svg
                          className="w-4 h-4"
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
                      ) : (
                        <svg
                          className="w-4 h-4"
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
                      )}
                    </button>
                  </div>
                </div>

                {/* 警告提示 */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-red-700">
                        警告:切勿泄露此{nestedDrawerTitle}。任何拥有您
                        {nestedDrawerTitle}
                        的人都可以窃取您账户中持有的任何资产。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 按钮区域 */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseNestedDrawer}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    关闭
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Index
