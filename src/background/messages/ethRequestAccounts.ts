import type { PlasmoMessaging } from "@plasmohq/messaging"

import { useWalletStore } from "~store"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const state = useWalletStore.getState()

  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html') + '?action=connect',
    type: 'popup',
    width: 400,
    height: 600,
    left: 100,
    top: 100
  }, (window) => {
    console.log("window", window)
  })

  res.send({ success: true, data: state })
}
 
export default handler
