import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { useLoading } from '~contexts/LoadingContext'
import "../style.css"

const SaveMnemonic = () => {
  const { setLoading } = useLoading()
  const location = useLocation()
  const navigate = useNavigate()
  const { mnemonic } = location.state || {}
  const [copied, setCopied] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleBack = () => {
    navigate(-1)
  }

  const handleCopyMnemonic = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  const handleContinue = () => {
    setLoading(true)
    if (isConfirmed) {
      navigate("/")
    }
    setLoading(false)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsConfirmed(e.target.checked)
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
        <h1 className="text-lg font-semibold text-gray-800">备份助记词</h1>
        <div className="w-8"></div>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        {/* 警告提示 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-start">
            <svg
              className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
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
              <h3 className="text-xs font-medium text-yellow-800 mb-1">
                重要提示
              </h3>
              <p className="text-xs text-yellow-700 leading-relaxed">
                请将助记词安全地备份到离线环境，切勿通过截屏、网络传输的方式保存。助记词一旦丢失，将无法恢复您的钱包资产。
              </p>
            </div>
          </div>
        </div>

        {/* 助记词显示区域 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">助记词</h2>
            <button
              onClick={() => setShowMnemonic(!showMnemonic)}
              className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
              {showMnemonic ? "隐藏" : "显示"}
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            {showMnemonic ? (
              <div className="grid grid-cols-3 gap-1.5">
                {mnemonic?.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded px-2 py-1.5 text-xs font-mono text-gray-800">
                    <span className="text-gray-400 text-xs mr-1">
                      {index + 1}
                    </span>
                    {word}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded px-2 py-1.5 text-xs">
                    <span className="text-gray-400 text-xs mr-1">
                      {index + 1}
                    </span>
                    ••••••••
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 复制按钮 */}
        {showMnemonic && (
          <button
            onClick={handleCopyMnemonic}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors mb-4 text-sm ${
              copied
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            }`}>
            {copied ? "✓ 已复制到剪贴板" : "复制助记词"}
          </button>
        )}

        {/* 确认复选框 */}
        <div className="mb-4">
          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={handleCheckboxChange}
              className="mt-0.5 w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-700 leading-relaxed">
              我已安全备份助记词，并了解助记词丢失将导致资产无法恢复的风险
            </span>
          </label>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={handleContinue}
          disabled={!isConfirmed}
          className={`w-full py-2.5 px-6 rounded-lg font-medium transition-colors text-sm ${
            isConfirmed
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}>
          完成备份
        </button>
      </div>
    </div>
  )
}

export default SaveMnemonic
