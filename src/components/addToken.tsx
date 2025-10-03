import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import "../style.css"

import { DEFAULT_NETWORKS, ERC20_ABI, type Token } from "~types/wallet"
import { useWalletStore } from "~store"
import { useLoading } from "~contexts/LoadingContext"
import { useMessage } from "~contexts/MessageContext"
import { ethers } from "ethers"

const AddToken = () => {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const { error, success } = useMessage()
  const { addToken, getProvider, switchNetwork, currentNetwork, currentAccount, tokens } = useWalletStore()
  const [selectedNetwork, setSelectedNetwork] = useState(
    DEFAULT_NETWORKS[0].name
  )
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [contractAddress, setContractAddress] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [decimalPrecision, setDecimalPrecision] = useState("")
  const [isAddressValid, setIsAddressValid] = useState(true)
  const [isFetchingToken, setIsFetchingToken] = useState(false)
  const [activeTokenType, setActiveTokenType] = useState<"ERC20" | "ERC721" | "ERC1155">("ERC20")

  // 验证以太坊合约地址格式
  const validateContractAddress = (address: string) => {
    if (!address.trim()) {
      setIsAddressValid(true) // 空值时不显示错误
      return
    }
    // 以太坊地址格式：0x开头 + 40个十六进制字符
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/
    setIsAddressValid(ethereumAddressRegex.test(address))
  }

  const handleContractAddressChange = (value: string) => {
    setContractAddress(value)
    validateContractAddress(value)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleAddCustomToken = async () => {
    const token: Token = {
      address: contractAddress!,
      symbol: tokenSymbol!,
      name: tokenName!,
      decimals: Number(decimalPrecision) || (activeTokenType === 'ERC20' ? 18 : 0),
      type: (activeTokenType as 'ERC20' | 'ERC721' | 'ERC1155') || 'ERC20'
    };

    if (tokens.some((token) => token.address === contractAddress)) {
      error("该代币已添加，请勿重复添加")
      return
    }

    setLoading(true, "正在添加代币...")
    try {
      await addToken(token)
      success("添加代币成功")
      navigate("/token-manager")
    } catch {
      error("添加代币失败")
    } finally {
      setLoading(false)
    }
  }

  const handleNetworkSelect = async (networkName: string) => {
    if (!currentNetwork) return 

    setSelectedNetwork(networkName)
    setShowNetworkDropdown(false)

    setLoading(true, "切换网络中...")
    try {
      await switchNetwork(networkName)
      success("切换网络成功")
    } catch {
      error("切换网络失败")
    } finally {
      setLoading(false)
    }
  }

  // 获取代币信息
  const getTokenInfo = async () => {
    setIsFetchingToken(true)

    if (activeTokenType === "ERC20") {
      try {
        const provider = await getProvider()
        if (!provider) return 
  
        const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)
        const name = await contract.name()
        const symbol = await contract.symbol()
        const decimals = await contract.decimals()
        setTokenSymbol(symbol)
        setTokenName(name)
        setDecimalPrecision(decimals.toString())
      } catch (err) {
        error("请检查合约地址或当前网络")
      } finally {
        setIsFetchingToken(false)
      }
    } else if (activeTokenType === "ERC721") {
      // TODO：ERC721_ABI
    } else {
      // TODO：ERC1155_ABI
    }
  }

  useEffect(() => {
    // 清空缓存
    setTokenSymbol("")
    setDecimalPrecision("")
    
    if (!contractAddress.trim()) return // 合约地址为空时不执行
    if (!isAddressValid) return // 地址格式无效时不执行

    if (currentNetwork && currentAccount) {
      getTokenInfo()
    }
  }, [currentAccount, currentNetwork, contractAddress, isAddressValid])

  useEffect(() => {
    // 清空缓存
    setContractAddress("")
    setTokenSymbol("")
    setDecimalPrecision("")
  }, [activeTokenType])

  const isFormValid = contractAddress.trim() !== "" && tokenSymbol.trim() !== "" && decimalPrecision.trim() !== "" && isAddressValid

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col relative">
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
          自定义币种
        </h1>
        <div className="w-8"></div>
      </div>

      {/* Token类型切换标签 */}
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(["ERC20", "ERC721", "ERC1155"] as const).map((tokenType) => (
            <button
              key={tokenType}
              onClick={() => setActiveTokenType(tokenType)}
              className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTokenType === tokenType
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}>
              {tokenType}
            </button>
          ))}
        </div>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {/* 网络选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              网络 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors text-sm">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-900">{selectedNetwork}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showNetworkDropdown ? "rotate-180" : ""
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
                  {DEFAULT_NETWORKS.map((network) => (
                    <button
                      key={network.name}
                      onClick={() => handleNetworkSelect(network.name)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm">
                      <span className="text-gray-900">{network.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 代币合约地址 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              代币合约地址 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => handleContractAddressChange(e.target.value)}
                placeholder="请输入代币合约地址"
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 text-sm text-gray-900 placeholder-gray-400 ${
                  !isAddressValid
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
              />
              {contractAddress && (
                <button
                  type="button"
                  onClick={() => handleContractAddressChange("")}
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
            {!isAddressValid && (
              <p className="text-red-500 text-sm mt-1">合约地址存在错误</p>
            )}
          </div>

          {/* 代币符号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              代币符号
            </label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-500 placeholder-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 小数精度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              小数精度
            </label>
            <input
              type="number"
              value={decimalPrecision}
              onChange={(e) => setDecimalPrecision(e.target.value)}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-500 placeholder-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={handleAddCustomToken}
          disabled={!isFormValid || isFetchingToken}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors text-sm ${
            isFormValid && !isFetchingToken
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}>
          添加自定义代币
        </button>
      </div>

      {/* 加载遮罩层 */}
      {isFetchingToken && (
        <div className="absolute inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-800 font-medium">正在获取代币信息...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddToken
