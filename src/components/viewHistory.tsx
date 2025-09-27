import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style.css"

const ViewHistory = () => {
  const navigate = useNavigate()
  const [selectedNetwork, setSelectedNetwork] = useState("全部网络")
  const [selectedType, setSelectedType] = useState("全部类型")
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)

  const handleBack = () => {
    navigate(-1)
  }

  const handleOpenBrowser = () => {
    console.log("打开浏览器查看历史")
    // TODO: 打开外部浏览器
  }

  const networks = [
    "全部网络",
    "Ethereum",
    "BSC",
    "Polygon",
    "Arbitrum"
  ]

  const types = [
    "全部类型",
    "发送",
    "接收",
    "兑换",
    "授权"
  ]

  const handleNetworkSelect = (network: string) => {
    setSelectedNetwork(network)
    setShowNetworkDropdown(false)
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setShowTypeDropdown(false)
  }

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
        <h1 className="text-lg font-semibold text-gray-800">历史</h1>
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* 筛选区域 */}
      <div className="px-4 py-4">
        <div className="flex space-x-3">
          {/* 网络筛选 */}
          <div className="flex-1 relative">
            <button
              onClick={() => {
                setShowNetworkDropdown(!showNetworkDropdown)
                setShowTypeDropdown(false)
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-100 transition-colors">
              <span className="text-gray-700">{selectedNetwork}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
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
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {networks.map((network) => (
                  <button
                    key={network}
                    onClick={() => handleNetworkSelect(network)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                      selectedNetwork === network ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}>
                    {network}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 类型筛选 */}
          <div className="flex-1 relative">
            <button
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown)
                setShowNetworkDropdown(false)
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-100 transition-colors">
              <span className="text-gray-700">{selectedType}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showTypeDropdown ? 'rotate-180' : ''
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

            {/* 类型下拉列表 */}
            {showTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                      selectedType === type ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 内容区域（无数据状态） */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* 双筒望远镜图标 */}
        <div className="mb-6">
          <svg
            className="w-20 h-20 text-gray-300"
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
        </div>

        {/* 提示文字 */}
        <div className="text-center">
          <p className="text-gray-500 text-sm leading-relaxed">
            更多交易数据,请前往浏览器查看
          </p>
        </div>

        {/* 查看浏览器按钮 */}
        <button
          onClick={handleOpenBrowser}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          前往浏览器查看
        </button>
      </div>
    </div>
  )
}

export default ViewHistory
