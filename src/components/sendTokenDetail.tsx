import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import "../style.css"

import { ethers } from "ethers"

import { useLoading } from "~contexts/LoadingContext"
import { useMessage } from "~contexts/MessageContext"
import { useGetBalance } from "~hooks/useGetBalance"
import { useWalletStore } from "~store"
import { ERC20_ABI } from "~types/wallet"

const SendTokenDetail = () => {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const { warning, error } = useMessage()
  const { getWallet, tokens, currentAccount, currentNetwork } = useWalletStore()
  const { ethBalance } = useGetBalance()
  const [searchParams] = useSearchParams()
  const tokenName = searchParams.get("tokenName")
  const [gasFee, setGasFee] = useState(0.001)

  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

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

    // 打开交易确认页面
    setShowConfirmDialog(true)
  }

  const handleConfirmTransaction = async () => {
    let tx = null // 存储交易信息
    const wallet = getWallet()
    if (!wallet) return

    setLoading(true, "正在发送交易...")
    try {
      if (currentToken.type === "ETH") {
        // 原生代币转账
        tx = await wallet.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount),
          gasLimit: "21000",
          gasPrice: ethers.parseUnits("20", "gwei")
        })
      } else if (currentToken.type === "ERC20") {
        // ERC20代币转账
        const contract = await new ethers.Contract(
          currentToken.address,
          ERC20_ABI,
          wallet
        )

        const transferAmount = ethers.parseUnits(amount, currentToken.decimals);

        tx = await contract.transfer(recipient, transferAmount, {
          gasLimit: "60000",
          gasPrice: ethers.parseUnits("20", "gwei")
        })
      } else if (currentToken.type === "ERC721") {
        // ERC721代币转账
      } else {
        // ERC1155代币转账
      }

      // 等待交易完成
      setLoading(true, "等待交易完成...")
      await tx.wait()

       // 跳转到首页
       navigate("/home", {
         state: { type: "发送", tx, amount, tokenName }
       })
    } catch (err) {
      error("交易失败", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelTransaction = () => {
    setShowConfirmDialog(false)
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
            <div className="relative">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="输入接收地址"
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm"
              />
              {recipient && (
                <button
                  type="button"
                  onClick={() => setRecipient("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg
                    className="w-4 h-4"
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
              )}
            </div>
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

      {/* 交易确认Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[400px] h-[600px] bg-white rounded-lg flex flex-col">
            {/* 顶部导航栏 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <button
                onClick={handleCancelTransaction}
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
              <h1 className="text-lg font-semibold text-gray-800">查看</h1>
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

            {/* 交易金额区域 */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                转账金额：{amount} {currentToken.symbol}
              </h2>

              {/* 信息卡片 */}
              <div className="w-full space-y-4">
                {/* 发送方与接收方 */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">自</span>
                      <span className="text-sm font-medium text-gray-800">
                        {currentAccount.address.slice(0, 6)}...
                        {currentAccount.address.slice(-4)}
                      </span>
                    </div>
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
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">至</span>
                      <span className="text-sm font-medium text-gray-800">
                        {recipient.slice(0, 6)}...{recipient.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 网络 */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">网络</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-800">
                        {currentNetwork.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 网络费用与速度 */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="space-y-3">
                    {/* 网络费 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">网络费</span>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-800">
                            0 ETH
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 速度 */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">速度</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🦊</span>
                        <span className="text-sm font-medium text-gray-800">
                          市场 ~12 秒
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-4 py-4 border-t border-gray-100 flex space-x-3">
              <button
                onClick={handleCancelTransaction}
                className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
                取消
              </button>
              <button
                onClick={handleConfirmTransaction}
                className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors">
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SendTokenDetail
