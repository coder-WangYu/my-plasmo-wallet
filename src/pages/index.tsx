import { useWalletStore } from "~store"
import Home from "./home"
import Login from "./login"
import Sign from "./sign"

const Index = () => {
  const { isLocked, accounts } = useWalletStore()
  console.log(isLocked, accounts)
  
  // 如果钱包被锁定，则显示登录页面
  if (isLocked) {
    return <Login />
  }

  // 如果钱包没有账户，则显示注册页面
  if (accounts.length === 0) {
    return <Sign />
  }

  // 如果钱包有账户且未锁定，则显示主页面
  return <Home />
}

export default Index
