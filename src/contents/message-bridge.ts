import { sendToBackground } from "@plasmohq/messaging"

// 保存事件类型
const EventType = {
  INJECT_WALLET: "injectWallet"
}

window.addEventListener("message", async (event) => {
  if (!event.data || !event.type) {
    return
  }
  
  if (EventType[event.data.type]) {    
    try {
      const res = await sendToBackground({
        name: EventType[event.data.type],
        body: event.data.data
      })

      console.log(res.status, res.msg)
    } catch (error) {
      console.error("发送消息失败:", error)
    }
  }
})
