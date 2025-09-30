import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../style.css"

import { useLoading } from "~contexts/LoadingContext"
import { useMessage } from "~contexts/MessageContext"

import iconUrl from "../../assets/icon.png"

const Sign = () => {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const { success, error } = useMessage()
  const [activeTab, setActiveTab] = useState("创建钱包")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mnemonic, setMnemonic] = useState("")
  const [importPassword, setImportPassword] = useState("")
  const [showImportPassword, setShowImportPassword] = useState(false)
  const [privateKey, setPrivateKey] = useState("")
  const [privateKeyPassword, setPrivateKeyPassword] = useState("")
  const [showPrivateKeyPassword, setShowPrivateKeyPassword] = useState(false)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleCreateWallet = async () => {
    if (password.length >= 8 && password === confirmPassword) {
      try {
        setLoading(true, "正在创建钱包...")

        // 模拟创建钱包的异步操作
        await new Promise((resolve) => setTimeout(resolve, 2000))

        console.log("创建钱包", { password })
        // TODO: 实际创建钱包逻辑

        success("钱包创建成功！")
        navigate("/")
      } catch (err) {
        console.error("创建钱包失败:", err)
        error("钱包创建失败，请重试")
      } finally {
        setLoading(false)
      }
    } else {
      error("密码长度至少8位且两次输入必须一致")
    }
  }

  const handleImportWallet = () => {
    if (mnemonic.trim() && importPassword.length >= 8) {
      console.log("导入钱包", { mnemonic, importPassword })
      // TODO: 实际导入钱包逻辑
      navigate("/")
    } else {
      console.log("助记词或密码验证失败")
    }
  }

  const handleImportPrivateKey = () => {
    if (privateKey.trim() && privateKeyPassword.length >= 8) {
      console.log("导入私钥", { privateKey, privateKeyPassword })
      // TODO: 实际导入私钥逻辑
      navigate("/")
    } else {
      console.log("私钥或密码验证失败")
    }
  }

  const isCreateFormValid = password.length >= 8 && password === confirmPassword
  const isImportFormValid = mnemonic.trim() && importPassword.length >= 8
  const isPrivateKeyFormValid =
    privateKey.trim() && privateKeyPassword.length >= 8

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* 顶部图标和标题 */}
      <div className="flex flex-col items-center pt-6 pb-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3">
          <img
            src={iconUrl}
            alt="DyWallet Logo"
            className="w-20 h-20 rounded-full"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">DyWallet</h1>
        <p className="text-gray-600 text-sm">安全的以太坊钱包</p>
      </div>

      {/* 标签页导航 */}
      <div className="px-4 pb-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { name: "创建钱包", id: "创建钱包" },
            { name: "导入助记词", id: "导入助记词" },
            { name: "导入私钥", id: "导入私钥" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 px-4">
        {activeTab === "创建钱包" && (
          <div className="space-y-4">
            {/* 标题 */}
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-700"
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
              <h2 className="text-lg font-semibold text-gray-800">
                创建新钱包
              </h2>
            </div>

            {/* 描述文字 */}
            <p className="text-gray-600 text-sm">
              创建一个新的以太坊钱包并生成助记词
            </p>

            {/* 密码设置 */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  设置密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码 (至少8位)"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "导入助记词" && (
          <div className="space-y-4">
            {/* 标题 */}
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">导入钱包</h2>
            </div>

            {/* 描述文字 */}
            <p className="text-gray-600 text-sm">使用现有的助记词导入钱包</p>

            {/* 助记词输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                助记词
              </label>
              <textarea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="输入12或24个助记词,用空格分隔"
                rows={4}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
              />
            </div>

            {/* 密码设置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                设置密码
              </label>
              <div className="relative">
                <input
                  type={showImportPassword ? "text" : "password"}
                  value={importPassword}
                  onChange={(e) => setImportPassword(e.target.value)}
                  placeholder="输入密码(至少8位)"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowImportPassword(!showImportPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    {showImportPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "导入私钥" && (
          <div className="space-y-4">
            {/* 标题 */}
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">导入私钥</h2>
            </div>

            {/* 描述文字 */}
            <p className="text-gray-600 text-sm">使用私钥导入账户</p>

            {/* 私钥输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                私钥
              </label>
              <input
                type="text"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="输入私钥 (0x开头的64位十六进制字符)"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* 密码设置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                设置密码
              </label>
              <div className="relative">
                <input
                  type={showPrivateKeyPassword ? "text" : "password"}
                  value={privateKeyPassword}
                  onChange={(e) => setPrivateKeyPassword(e.target.value)}
                  placeholder="输入密码 (至少8位)"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPrivateKeyPassword(!showPrivateKeyPassword)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    {showPrivateKeyPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-4">
        {activeTab === "创建钱包" && (
          <button
            onClick={handleCreateWallet}
            disabled={!isCreateFormValid}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              isCreateFormValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}>
            创建钱包
          </button>
        )}

        {activeTab === "导入助记词" && (
          <button
            onClick={handleImportWallet}
            disabled={!isImportFormValid}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              isImportFormValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}>
            导入钱包
          </button>
        )}

        {activeTab === "导入私钥" && (
          <button
            onClick={handleImportPrivateKey}
            disabled={!isPrivateKeyFormValid}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              isPrivateKeyFormValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}>
            导入私钥
          </button>
        )}
      </div>
    </div>
  )
}

export default Sign
