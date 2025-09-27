import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../style.css"

const WalletManager = () => {
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    privateKey: true,
    wallet01: true
  })

  const handleClose = () => {
    navigate(-1)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleWalletManagement = () => {
    console.log("钱包管理")
  }

  const handleAddWallet = () => {
    console.log("添加钱包")
  }

  const handleAddAccount = () => {
    console.log("添加账户")
  }

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <button
          onClick={handleClose}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex-1 text-center">
          <div className="text-sm text-gray-500">总资产</div>
          <div className="text-2xl font-bold text-gray-900">$110.25</div>
        </div>
        <div className="w-8"></div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* 私钥钱包分组 */}
        <div className="mb-4">
          <div
            onClick={() => toggleSection('privateKey')}
            className="flex items-center justify-between py-3 cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-medium text-gray-900">私钥钱包</span>
              <span className="text-sm text-gray-500">$110.25</span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.privateKey ? 'rotate-180' : ''
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
          </div>

          {expandedSections.privateKey && (
            <div className="ml-4 border-l-2 border-gray-100 pl-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></div>
                  <span className="text-gray-900">私钥钱包01</span>
                </div>
                <span className="text-gray-900 font-medium">$110.25</span>
              </div>
            </div>
          )}
        </div>

        {/* 钱包01分组 */}
        <div className="mb-4">
          <div
            onClick={() => toggleSection('wallet01')}
            className="flex items-center justify-between py-3 cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-medium text-gray-900">钱包01</span>
              <span className="text-sm text-gray-500">$0.00</span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.wallet01 ? 'rotate-180' : ''
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
          </div>

          {expandedSections.wallet01 && (
            <div className="ml-4 border-l-2 border-gray-100 pl-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full"></div>
                  <span className="text-gray-900">账户01</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">$0.00</span>
                  <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 添加账户 */}
        <div
          onClick={handleAddAccount}
          className="flex items-center space-x-3 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <span className="text-gray-900">添加账户</span>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex space-x-3">
          <button
            onClick={handleWalletManagement}
            className="flex-1 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors">
            钱包管理
          </button>
          <button
            onClick={handleAddWallet}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            添加钱包
          </button>
        </div>
      </div>
    </div>
  )
}

export default WalletManager
