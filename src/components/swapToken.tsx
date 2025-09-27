import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style.css"

const SwapToken = () => {
  const navigate = useNavigate()
  const [fromAmount, setFromAmount] = useState("0.00")
  const [toAmount, setToAmount] = useState("0.00")
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDT")

  const handleBack = () => {
    navigate(-1)
  }

  const handleSwap = () => {
    console.log("执行兑换")
    // TODO: 实现兑换逻辑
  }

  const handleSwapTokens = () => {
    // 交换代币
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    
    // 交换数量
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const fromTokenData = {
    ETH: { name: "Ethereum", icon: "🔵", balance: "0", symbol: "ETH" },
    USDT: { name: "Tether USD", icon: "🟢", balance: "0", symbol: "USDT" },
    BNB: { name: "BNB", icon: "⚫", balance: "0", symbol: "BNB" },
    OCB: { name: "OneCoinBuy", icon: "🟣", balance: "40.93", symbol: "OCB" }
  }

  const toTokenData = {
    ETH: { name: "Ethereum", icon: "🔵", balance: "0", symbol: "ETH" },
    USDT: { name: "Tether USD", icon: "🟢", balance: "0", symbol: "USDT" },
    BNB: { name: "BNB", icon: "⚫", balance: "0", symbol: "BNB" },
    OCB: { name: "OneCoinBuy", icon: "🟣", balance: "40.93", symbol: "OCB" }
  }

  const isSwapDisabled = fromAmount === "0.00" || fromAmount === ""

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
        <h1 className="text-lg font-semibold text-gray-800">兑换</h1>
        <div className="w-8"></div>
      </div>

      {/* 主兑换界面 */}
      <div className="flex-1 px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          {/* From 部分 */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">从</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {fromTokenData[fromToken as keyof typeof fromTokenData].icon}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">🔷</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-800">{fromToken}</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                </div>
                <div className="text-sm text-gray-500">
                  {fromTokenData[fromToken as keyof typeof fromTokenData].name}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {fromTokenData[fromToken as keyof typeof fromTokenData].balance}
                  </span>
                  <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                    充值
                  </span>
                </div>
                <div className="text-2xl font-semibold text-gray-800">
                  {fromAmount}
                </div>
              </div>
            </div>
          </div>

          {/* 交换按钮 */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleSwapTokens}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          {/* To 部分 */}
          <div>
            <div className="text-xs text-gray-500 mb-2">至</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                    {toTokenData[toToken as keyof typeof toTokenData].icon}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">🔷</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-800">{toToken}</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                </div>
                <div className="text-sm text-gray-500">
                  {toTokenData[toToken as keyof typeof toTokenData].name}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {toTokenData[toToken as keyof typeof toTokenData].balance}
                  </span>
                </div>
                <div className="text-2xl font-semibold text-gray-800">
                  {toAmount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部兑换按钮 */}
      <div className="px-4 py-4">
        <button
          onClick={handleSwap}
          disabled={isSwapDisabled}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
            isSwapDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}>
          兑换
        </button>
      </div>
    </div>
  )
}

export default SwapToken
