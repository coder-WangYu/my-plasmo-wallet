import "@plasmohq/messaging/background"

import { startHub } from "@plasmohq/messaging/pub-sub"

// 注入钱包到主世界
const injectWalletToMainWorld = (tabId: number) => {
  console.log("开始注入到 tabId:", tabId)

  if (!chrome.scripting) {
    console.error("chrome.scripting 不可用，请检查权限配置")
    return
  }

  try {
    chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: () => {
        // 创建简单的钱包对象
        const testWallet = {
          name: "DyWallet",
          version: "1.0.0",
          isTest: true,
          isDyWallet: true
        }

        // 注入到主世界
        ;(window as any).testWallet = testWallet
        ;(window as any).mywallet = testWallet

        if ((window as any).ethereum) {
          const existingProvider = (window as any).ethereum
          ;(window as any).ethereum = {
            providers: [existingProvider, testWallet],
            ...existingProvider
          }
        } else {
          ;(window as any).ethereum = testWallet
        }

        // 触发事件
        window.postMessage(
          {
            type: "INJECT_WALLET",
            data: testWallet,
            requestId: "123"
          },
          "*"
        )
      }
    })
  } catch (error) {
    console.error("注入失败:", error)
  }
}

// 自动注入DyWallet
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url)

    // 跳过 chrome:// 和 chrome-extension:// URL
    if (url.protocol === "chrome:" || url.protocol === "chrome-extension:") {
      console.log("跳过 chrome:// URL:", tab.url)
      return
    }

    // 只处理 http://localhost 和 https:// URL
    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.protocol === "https:"
    ) {
      console.log("页面加载完成:", tab.url)

      // 延迟注入，确保页面完全加载
      setTimeout(() => {
        injectWalletToMainWorld(tabId)
      }, 2000)
    }
  }
})

// 监听扩展安装/启动
chrome.runtime.onInstalled.addListener(() => {
  console.log("扩展已安装")
})

chrome.runtime.onStartup.addListener(() => {
  console.log("扩展已启动")
})

// 启动Hub：用于中转content和background
startHub()
