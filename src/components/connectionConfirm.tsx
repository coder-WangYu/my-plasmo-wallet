import { useEffect, useState } from "react"
import { useWalletStore } from "~store"

interface ConnectionConfirmProps {
  connectionId: string
  onApprove: (account: string) => void
  onReject: () => void
}

export default function ConnectionConfirm({ connectionId, onApprove, onReject }: ConnectionConfirmProps) {
  const { currentAccount, isLocked } = useWalletStore()
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    if (!currentAccount) {
      alert("请先解锁钱包")
      return
    }

    setLoading(true)
    try {
      onApprove(currentAccount.address)
    } catch (error) {
      console.error("连接确认失败:", error)
      alert("连接确认失败")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = () => {
    onReject()
  }

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">钱包已锁定</h2>
          <p className="text-gray-600 mb-6">请先解锁钱包以进行连接</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold">连接确认</h1>
        <button
          onClick={handleReject}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">DApp 请求连接</h2>
          <p className="text-gray-600 mb-6">
            一个 DApp 正在请求连接到你的钱包
          </p>

          {currentAccount && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">将连接的账户：</p>
              <p className="font-mono text-sm">
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{currentAccount.name}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleApprove}
              disabled={loading || !currentAccount}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "确认中..." : "确认连接"}
            </button>
            
            <button
              onClick={handleReject}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
            >
              拒绝连接
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
