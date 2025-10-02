import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import "../style.css"

import { useMessage } from "~contexts/MessageContext"
import { useGetBalance } from "~hooks/useGetBalance"
import { useWalletStore } from "~store"

const SendTokenDetail = () => {
  const navigate = useNavigate()
  const { warning } = useMessage()
  const { tokens } = useWalletStore()
  const { ethBalance } = useGetBalance()
  const [searchParams] = useSearchParams()
  const tokenName = searchParams.get("tokenName")
  const [gasFee, setGasFee] = useState(0.001)

  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")

  const currentToken = tokens.find((token) => token.name === tokenName)

  const handleBack = () => {
    navigate(-1)
  }

  const handleSend = () => {
    if (Number(ethBalance) < gasFee) {
      return warning("ETH余额不足以支付Gas费用，请先充值")
    }

    if (
      tokenName === "Ethereum" &&
      (Number(amount) >= Number(ethBalance) ||
        Number(amount) >= Number(ethBalance) + gasFee)
    ) {
      return warning("ETH余额不足以支付Gas费用，请先充值")
    }
    // TODO: 实现发送逻辑
    console.log("发送代币:", { tokenName, amount, recipient })
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
        <h1 className="text-lg font-semibold text-gray-800">
          发送 {tokenName}
        </h1>
        <div className="w-8"></div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {/* 代币信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
                🟣
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{tokenName}</h3>
                <p className="text-sm text-gray-500">
                  余额: {currentToken.balance} {currentToken.symbol}
                </p>
              </div>
            </div>
          </div>

          {/* 接收地址 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              接收地址
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="输入接收地址"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>

          {/* 发送数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              发送数量
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {currentToken.symbol}
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                可用余额: {currentToken.balance} {currentToken.symbol}
              </span>
              <button
                className="text-xs text-blue-600 hover:text-blue-700"
                onClick={() => setAmount(currentToken.balance)}>
                全部
              </button>
            </div>
          </div>

          {/* 手续费 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">网络手续费</span>
              <span className="text-sm font-medium text-gray-800">
                {gasFee} ETH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={handleSend}
          disabled={!amount || !recipient}
          className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 text-sm ${
            amount && recipient
              ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
              : "bg-gray-200 text-gray-600 cursor-not-allowed"
          }`}>
          发送
        </button>
      </div>
    </div>
  )
}

export default SendTokenDetail
