import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import "../style.css"

import { useMessage } from "~contexts/MessageContext"
import { useGetBalance } from "~hooks/useGetBalance"
import { useWalletStore } from "~store"
import type { Token } from "~types/wallet"
import { useLoading } from "~contexts/LoadingContext"

const TokenManager = () => {
  const navigate = useNavigate()
  const { tokens, removeToken } = useWalletStore()
  const { setLoading } = useLoading()
  const { error, success } = useMessage()
  const { getTokenBalance, getAllTokenBalance, refreshBalance } =
    useGetBalance()
  const [searchQuery, setSearchQuery] = useState("")
  const [isTokensExpanded, setIsTokensExpanded] = useState(true)
  const [isNFTsExpanded, setIsNFTsExpanded] = useState(true)
  const [refreshingToken, setRefreshingToken] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [addedTokens, setAddedTokens] = useState<Token[]>([])
  const [addedNFTs, setAddedNFTs] = useState<Token[]>([])

  const handleBack = () => {
    navigate(-1)
  }

  const handleAddToken = () => {
    navigate("/add-token")
  }

  const handleRemoveToken = async (
    tokenSymbol: string,
    tokenAddress: string
  ) => {
    setLoading(true, "正在移除代币...")
    try {
      await removeToken(tokenAddress)
      success(`${tokenSymbol}已被移除！`)
      await refreshBalance()
    } catch {
      error("移除失败...")
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshToken = async (tokenAddress: string) => {
    if (refreshingToken) return // 防止重复点击

    setRefreshingToken(tokenAddress)
    try {
      const token = tokens.find((t) => t.address === tokenAddress)
      if (!token) return

      await getTokenBalance(token)
    } catch {
      error("刷新余额失败...")
    } finally {
      setRefreshingToken(null)
    }
  }

  const filteredAddedTokens = addedTokens.filter((token) =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAddedNFTs = addedNFTs.filter((nft) =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    setAddedTokens(tokens.filter((token) => token.type === "ERC20"))
    setAddedNFTs(tokens.filter((token) => token.type === "ERC721"))

    // 只在初始化时调用 getAllTokenBalance
    if (!isInitialized && tokens.length > 0) {
      getAllTokenBalance()
      setIsInitialized(true)
    }
  }, [tokens])

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
          币种管理
        </h1>
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
            placeholder="搜索代币或合约地址"
            className={`w-full py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${
              searchQuery ? "pl-10 pr-12" : "pl-10 pr-4"
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
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

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* 添加代币 */}
        <div
          onClick={handleAddToken}
          className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-gray-900">添加代币</span>
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

        {/* 已添加代币 */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">已添加代币</h2>
            <button
              onClick={() => setIsTokensExpanded(!isTokensExpanded)}
              className="p-1 rounded hover:bg-gray-100 transition-colors">
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  isTokensExpanded ? "" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
          {isTokensExpanded &&
            filteredAddedTokens.map((token, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                      🟣
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {token.symbol}
                    </div>
                    <div className="text-sm text-gray-500">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right mr-2">
                    <div className="text-sm font-medium text-gray-800">
                      {token.balance || "0.00"}
                    </div>
                    <div className="text-xs text-gray-500">$0.00</div>
                  </div>
                  <button
                    onClick={() => handleRefreshToken(token.address)}
                    disabled={refreshingToken === token.address}
                    className="p-1.5 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 group">
                    <svg
                      className={`w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors ${refreshingToken === token.address ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveToken(token.symbol, token.address)
                    }
                    disabled={refreshingToken === token.address}
                    className="p-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-50 group">
                    <svg
                      className="w-4 h-4 text-gray-500 group-hover:text-red-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* 加载遮罩层 - 刷新 */}
                {refreshingToken === token.address && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

              </div>
            ))}
        </div>

        {/* 已添加NFT */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">已添加NFT</h2>
            <button
              onClick={() => setIsNFTsExpanded(!isNFTsExpanded)}
              className="p-1 rounded hover:bg-gray-100 transition-colors">
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  isNFTsExpanded ? "" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
          {isNFTsExpanded &&
            filteredAddedNFTs.map((nft, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    🦧
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {nft.symbol}
                    </div>
                    <div className="text-sm text-gray-500">
                      {nft.address.slice(0, 6)}...{nft.address.slice(-4)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right mr-2">
                    <div className="text-sm font-medium text-gray-800">--</div>
                    <div className="text-xs text-gray-500">NFT</div>
                  </div>
                  <button
                    onClick={() => handleRefreshToken(nft.address)}
                    disabled={refreshingToken === nft.address}
                    className="p-1.5 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 group">
                    <svg
                      className={`w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors ${refreshingToken === nft.address ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleRemoveToken(nft.symbol, nft.address)}
                    disabled={refreshingToken === nft.address}
                    className="p-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-50 group">
                    <svg
                      className="w-4 h-4 text-gray-500 group-hover:text-red-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* 加载遮罩层 - 刷新 */}
                {refreshingToken === nft.address && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default TokenManager
