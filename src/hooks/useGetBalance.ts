import { ethers } from "ethers"
import { useEffect, useState } from "react"

import { useLoading } from "~contexts/LoadingContext"
import { useMessage } from "~contexts/MessageContext"
import { useWalletStore } from "~store"
import { ERC20_ABI, type Token } from "~types/wallet"

export const useGetBalance = () => {
  const { setLoading } = useLoading()
  const { error } = useMessage()
  const { getProvider, updateTokenBalance, currentAccount, currentNetwork, tokens } =
    useWalletStore()
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

  // 获取代币余额
  const getTokenBalance = async (token: Token) => {
    if (!currentAccount || !currentNetwork) return

    try {
      const provider = getProvider()
      if (!provider) return

      if (token.type === "ERC20") {
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider)
        const balance = await contract.balanceOf(currentAccount.address)
        const formattedBalance = Number(
          ethers.formatUnits(balance, token.decimals)
        ).toFixed(4)

        await updateTokenBalance(token.address, formattedBalance)
      } else if (token.type === "ERC721") {
        // TODO：ERC721
      } else {
        // TODO：ERC1155
      }
    } catch {
      error("查询代币余额失败...")
    }
  }

  // 获取全部代币余额
  const getAllTokenBalance = async () => {
    if (!currentAccount || !currentNetwork) return

    setLoading(true)
    try {
      await Promise.all(tokens.map(token => getTokenBalance(token)));
    } catch {
      error("查询代币失败...")
    } finally {
      setLoading(false)
    }
  }

  // 刷新余额
  const refreshBalance = async () => {
    await Promise.all([
      getEthBalance(), 
      getAllTokenBalance()
    ])
  }

  useEffect(() => {
    getEthBalance()
  }, [currentAccount, currentNetwork])

  return {
    ethBalance,
    refreshBalance,
    getTokenBalance,
    getAllTokenBalance,
  }
}
