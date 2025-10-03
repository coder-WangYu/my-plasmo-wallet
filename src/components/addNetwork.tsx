import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useLoading } from "~contexts/LoadingContext"
import { useMessage } from "~contexts/MessageContext"
import { useWalletStore } from "~store"
import type { Network } from "~types/wallet"

const AddNetwork = () => {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const { success, error } = useMessage()
  const { networks, addNetwork } = useWalletStore()

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    rpcUrl: "",
    chainId: "",
    symbol: "",
    blockExplorerUrl: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const requiredFields = ["name", "rpcUrl", "chainId", "symbol"]

  const validateField = (field: string, value: string) => {
    if (requiredFields.includes(field) && !value.trim()) {
      return "不能为空"
    }

    switch (field) {
      case "rpcUrl":
        if (value && !/^https?:\/\/.+/.test(value)) {
          return "请输入有效的URL"
        }
        break
      case "chainId":
        if (value && !/^\d+$/.test(value)) {
          return "请输入有效的链ID"
        }
        break
      case "blockExplorerUrl":
        if (value && !/^https?:\/\/.+/.test(value)) {
          return "请输入有效的URL"
        }
        break
    }

    return ""
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // 实时验证
    const error = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof typeof formData]
      )
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return (
      requiredFields.every((field) =>
        formData[field as keyof typeof formData].trim()
      ) && Object.values(errors).every((error) => !error)
    )
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      error("请填写所有必填字段")
      return
    }

    const network: Network = {
      id: formData.name!.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name!,
      rpcUrl: formData.rpcUrl!,
      chainId: parseInt(formData.chainId!),
      symbol: formData.symbol!,
      blockExplorerUrl: formData.blockExplorerUrl || undefined,
      isMainnet: formData.name.includes("Mainnet")
    }

    console.log(networks)
    console.log(network)

    const isExists = networks.some((item) => item.id === network.id)

    if (isExists) {
      error("网络已存在")
      return
    }

    setLoading(true, "正在添加网络...")
    try {
      addNetwork(network)
      success("网络添加成功")

      // 重置表单数据
      setFormData({
        id: "",
        name: "",
        rpcUrl: "",
        chainId: "",
        symbol: "",
        blockExplorerUrl: ""
      })

      navigate(-1)
    } catch (err) {
      error("添加网络失败")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg
            className="w-5 h-5 text-gray-600"
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

        <h1 className="text-lg font-semibold text-gray-800">添加自定义网络</h1>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
        {/* 网络名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            网络名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="例如: Ethereum"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* RPC URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RPC URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={formData.rpcUrl}
            onChange={(e) => handleInputChange("rpcUrl", e.target.value)}
            placeholder="例如: https://etc.rivet.link"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.rpcUrl ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.rpcUrl && (
            <p className="mt-0.5 text-xs text-red-500">{errors.rpcUrl}</p>
          )}
        </div>

        {/* 链 ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            链 ID <span className="text-blue-500 text-xs">ⓘ</span>{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.chainId}
            onChange={(e) => handleInputChange("chainId", e.target.value)}
            placeholder="例如: 1"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.chainId ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.chainId && (
            <p className="mt-0.5 text-xs text-red-500">{errors.chainId}</p>
          )}
        </div>

        {/* 符号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            符号 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => handleInputChange("symbol", e.target.value)}
            placeholder="例如: ETH"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.symbol ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.symbol && (
            <p className="mt-0.5 text-xs text-red-500">{errors.symbol}</p>
          )}
        </div>

        {/* 区块链浏览器 URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            区块链浏览器 URL
          </label>
          <input
            type="url"
            value={formData.blockExplorerUrl}
            onChange={(e) =>
              handleInputChange("blockExplorerUrl", e.target.value)
            }
            placeholder="例如: https://ethereum.org"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.blockExplorerUrl ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.blockExplorerUrl && (
            <p className="mt-0.5 text-xs text-red-500">
              {errors.blockExplorerUrl}
            </p>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm ${
              isFormValid()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}>
            添加
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddNetwork
