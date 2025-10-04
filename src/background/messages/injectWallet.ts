import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const wallet = req.body
 
  res.send({
    status: "DyWallet钱包已成功注入：",
    msg: wallet
  })
}
 
export default handler