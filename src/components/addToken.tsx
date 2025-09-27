import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style.css"

const AddToken = () => {
  const navigate = useNavigate()
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum")
  const [contractAddress, setContractAddress] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [decimalPrecision, setDecimalPrecision] = useState("")
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)

  const handleBack = () => {
    navigate(-1)
  }

  const handleAddCustomToken = () => {
    if (contractAddress.trim()) {
      console.log("添加自定义代币", {
        network: selectedNetwork,
        contractAddress,
        tokenSymbol,
        decimalPrecision
      })
      // TODO: 实际添加代币逻辑
      navigate(-1)
    }
  }

  const networks = [
    { name: "Ethereum", icon: "🟣", chainId: 1 },
    { name: "BSC", icon: "🟡", chainId: 56 },
    { name: "Polygon", icon: "🟣", chainId: 137 },
    { name: "Arbitrum", icon: "🔵", chainId: 42161 }
  ]

  const isFormValid = contractAddress.trim() !== ""

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
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">自定义币种</h1>
        <div className="w-8"></div>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-6">
          {/* 网络选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              网络 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
                  </div>
                  <span className="text-gray-900">{selectedNetwork}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showNetworkDropdown ? 'rotate-180' : ''
                  }`}
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

              {/* 网络下拉列表 */}
              {showNetworkDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  {networks.map((network) => (
                    <button
                      key={network.name}
                      onClick={() => {
                        setSelectedNetwork(network.name)
                        setShowNetworkDropdown(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3">
                      <span className="text-lg">{network.icon}</span>
                      <span className="text-gray-900">{network.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 代币合约地址 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              代币合约地址 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="请输入代币合约地址"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* 代币符号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              代币符号
            </label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              placeholder="代币符号"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* 小数精度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              小数精度
            </label>
            <input
              type="number"
              value={decimalPrecision}
              onChange={(e) => setDecimalPrecision(e.target.value)}
              placeholder="小数精度"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={handleAddCustomToken}
          disabled={!isFormValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}>
          添加自定义代币
        </button>
      </div>
    </div>
  )
}

export default AddToken
