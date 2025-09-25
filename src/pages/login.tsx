import { useState } from "react"

import "../style.css"

import iconUrl from "../../assets/icon.png"

const Login = () => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-6">
        <img src={iconUrl} alt="Gate Wallet Logo" className="w-40 h-40" />
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold text-gray-800 mb-1">
          DongYu钱包，通往Web3世界
        </h1>
        <h2 className="text-lg font-bold text-gray-800">的大门</h2>
      </div>

      {/* Password Input */}
      <div className="w-full mb-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入密码"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Unlock Button */}
      <button className="w-full bg-gray-200 text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 mb-3 text-sm">
        解锁
      </button>

      {/* Forgot Password Link */}
      <button className="text-gray-400 text-xs hover:text-gray-600 transition-colors duration-200">
        忘记密码
      </button>
    </div>
  )
}

export default Login
