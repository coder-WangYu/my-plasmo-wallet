import { sendToBackground } from "@plasmohq/messaging"

// 保存事件类型
const EventType = {
  // INJECT_WALLET: "injectWallet",
  GET_WALLET_STATE: "getWalletState",
  ETH_REQUEST_ACCOUNTS: "ethRequestAccounts",
  WALLET_WATCH_ASSET: "walletWatchAsset",
  WALLET_ADD_ETHEREUM_CHAIN: "walletAddEthereumChain",
  WALLET_SWITCH_ETHEREUM_CHAIN: "walletSwitchEthereumChain",
  ETH_SEND_TRANSACTION: "ethSendTransaction",
  ETH_SIGN: "ethSign",
  ETH_SIGN_TYPED_DATA: "ethSignTypedData"
}

window.addEventListener("message", async (event) => {
  if (!event.data || !event.type) {
    return
  }
  
  if (EventType[event.data.type]) {  
    console.log("event.data.type", event.data.type, event)
    try {
      const res = await sendToBackground({
        name: EventType[event.data.type],
        body: event.data
      })

      console.log("message-bridge", res)

      // 发送响应消息回主世界
      const responseData = {
        type: `${event.data.type}_RESPONSE`,
        requestId: event.data.requestId,
        success: res.success !== false,
        data: res.data,
        error: res.error
      }

      window.postMessage(responseData, "*")
    } catch (error) {
      // 发送错误响应回主世界
      const errorResponse = {
        type: `${event.data.type}_RESPONSE`,
        requestId: event.data.requestId,
        success: false,
        error: error.message || "Unknown error"
      }

      window.postMessage(errorResponse, "*")
    }
  }
})
