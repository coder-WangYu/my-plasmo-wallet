import { ethers } from "ethers"
import { useEffect, useState } from "react"

import { useLoading } from "~contexts/LoadingContext"
import { useMessage } from "~contexts/MessageContext"
import { useWalletStore } from "~store"

export const useGetBalance = () => {
  const { setLoading } = useLoading()
  const { error } = useMessage()
  const { getProvider, currentAccount, currentNetwork } = useWalletStore()
  const [ethBalance, setEthBalance] = useState<string>("0")

  // 获取ETH余额
  const getEthBalance = async () => {
    if (!currentAccount || !currentNetwork) return

    setLoading(true)
    try {
      const provider = getProvider()
      if (!provider) return

      const balance = await provider.getBalance(currentAccount.address)
      setEthBalance(Number(ethers.formatEther(balance)).toFixed(4))
    } catch {
      error("查询ETH失败...")
    } finally {
      setLoading(false)
    }
  }

  // 刷新余额
  const refreshBalance = async () => {
    await getEthBalance()
  }

  useEffect(() => {
    getEthBalance()
  }, [currentAccount, currentNetwork])

  return {
    ethBalance,
    refreshBalance,
  }
}
