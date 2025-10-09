import type { PlasmoMessaging } from "@plasmohq/messaging"
import { useWalletStore } from "~store"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const state = useWalletStore.getState()

  res.send({ name: req.name, data: state })
}
 
export default handler
