// 钱包注入助手 - 将被注入到网页的MAIN世界中
export default function injectMyWallet() {
  console.log("开始注入 DyWallet");
  
  // 安全的序列化函数
  function safeSerialize(obj) {
    // 处理 undefined 和 null
    if (obj === undefined || obj === null) {
      return null;
    }
    
    try {
      // 先序列化，如果失败就返回 null
      const serialized = JSON.stringify(obj);
      if (serialized === 'undefined') {
        return null;
      }
      return JSON.parse(serialized);
    } catch (error) {
      console.warn("序列化失败，使用默认值:", error);
      return null;
    }
  }

  // 通用消息发送函数
  function sendMessageToExtension(type, data = {}) {
    return new Promise((resolve, reject) => {
      const requestId = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      
      const handleResponse = (event) => {
        if (event.data.type === `${type}_RESPONSE` && event.data.requestId === requestId) {
          window.removeEventListener("message", handleResponse);
          
          if (event.data.success) {
            resolve(event.data.data || event.data);
          } else {
            reject(new Error(event.data.error || 'Request failed'));
          }
        }
      };
      
      window.addEventListener("message", handleResponse);
      
      // 确保数据可序列化
      const serializableData = safeSerialize(data);
      
      const message = {
        type: type,
        data: serializableData,
        requestId: requestId
      };

      // 再次确保整个消息可序列化
      try {
        const serializedMessage = JSON.stringify(message);
        if (serializedMessage === 'undefined') {
          throw new Error("Message serialized to undefined");
        }
        window.postMessage(message, "*");
      } catch (error) {
        console.error("消息序列化失败:", error);
        reject(new Error("Message serialization failed"));
      }
    });
  }

  // 在MAIN世界中定义完整的钱包提供者类
  class MyWalletProvider {
    public isDyWallet = true;
    public isMetaMask = false;
    public isCoinbaseWallet = false;
    public isRabby = false;
    public isBraveWallet = false;
    public isTrust = false;
    public _metamask = false;
    public providers = [];
    public selectedAddress = null;
    public chainId = null;
    public networkVersion = null;
    
    private eventListeners = new Map();
    private connectedAccounts = [];

    constructor() {
      this.providers = [this];
      this.updateWalletState();
    }

    private updateWalletState() {
      // 通过消息获取钱包状态
      sendMessageToExtension("GET_WALLET_STATE").then((response) => {
        if (response && !response.isLocked && response.currentAccount) {
          this.selectedAddress = response.currentAccount.address;
          this.chainId = `0x${response.currentNetwork.chainId.toString(16)}`;
          this.networkVersion = response.currentNetwork.chainId.toString();
        } else {
          this.selectedAddress = null;
          this.chainId = null;
          this.networkVersion = null;
        }
      }).catch((error) => {
        console.error("Failed to get wallet state:", error);
        this.selectedAddress = null;
        this.chainId = null;
        this.networkVersion = null;
      });
    }

    async request(request) {
      const { method, params = [] } = request;

      switch (method) {
        case 'eth_requestAccounts':
         return this.handleRequestAccounts();
        
        case 'eth_accounts':
          return this.connectedAccounts;
        
        case 'eth_chainId':
          this.updateWalletState();
          return this.chainId;
        
        case 'net_version':
          this.updateWalletState();
          return this.networkVersion;
        
        case 'wallet_watchAsset':
          return this.handleWatchAsset(params[0]);
        
        case 'wallet_addEthereumChain':
          return this.handleAddEthereumChain(params[0]);
        
        case 'wallet_switchEthereumChain':
          return this.handleSwitchEthereumChain(params[0]);
        
        case 'eth_sendTransaction':
          return this.handleSendTransaction(params[0]);
        
        case 'eth_sign':
        case 'personal_sign':
          return this.handleSign(method, params);
        
        case 'eth_signTypedData':
        case 'eth_signTypedData_v3':
        case 'eth_signTypedData_v4':
          return this.handleSignTypedData(method, params);
        
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    }

    // EIP-1102: eth_requestAccounts
    private async handleRequestAccounts() {
      try {
        const response = await sendMessageToExtension("ETH_REQUEST_ACCOUNTS");
        this.connectedAccounts = response.accounts;
        this.selectedAddress = response.currentAccount;
        this.emit('accountsChanged', response.currentAccount);
        return response.accounts;
      } catch (error) {
        throw new Error(error.message || 'Failed to get accounts');
      }
    }

    // EIP-747: wallet_watchAsset
    private async handleWatchAsset(params) {
      return sendMessageToExtension("WALLET_WATCH_ASSET", params);
    }

    private async handleAddEthereumChain(params) {
      return sendMessageToExtension("WALLET_ADD_ETHEREUM_CHAIN", params);
    }

    private async handleSwitchEthereumChain(params) {
      const result = await sendMessageToExtension("WALLET_SWITCH_ETHEREUM_CHAIN", params);
      this.emit('chainChanged', params.chainId);
      return result;
    }

    private async handleSendTransaction(params) {
      const response = await sendMessageToExtension("ETH_SEND_TRANSACTION", params);
      return response.transactionHash;
    }

    private async handleSign(method, params) {
      const response = await sendMessageToExtension("ETH_SIGN", { method, params });
      return response.signature;
    }

    private async handleSignTypedData(method, params) {
      const response = await sendMessageToExtension("ETH_SIGN_TYPED_DATA", { method, params });
      return response.signature;
    }

    on(event, handler) {
    if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, []);
      }
      this.eventListeners.get(event).push(handler);
    }

    removeListener(event, handler) {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(handler);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }

    private emit(event, data) {
      const listeners = this.eventListeners.get(event);
    if (listeners) {
        listeners.forEach(listener => {
          try {
            listener(data);
          } catch (error) {
            console.error('Error in event listener:', error);
          }
        });
      }
    }
  }

  // 创建钱包实例
  const dyWallet = new MyWalletProvider();

  // 注入到主世界
  (window as any).DyWallet = dyWallet;
  (window as any).testWallet = dyWallet;
  (window as any).mywallet = dyWallet;

  if ((window as any).ethereum) {
    const existingProvider = (window as any).ethereum;
    if (existingProvider.providers) {
      existingProvider.providers.push(dyWallet);
    } else {
      (window as any).ethereum = {
        providers: [existingProvider, dyWallet],
        ...existingProvider
      };
    }
  } else {
    (window as any).ethereum = dyWallet;
  }

  console.log("DyWallet 完整钱包注入完成:", dyWallet);

  // 触发事件
  window.postMessage(
    {
      type: "INJECT_WALLET",
      data: dyWallet,
      requestId: Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
    },
    "*"
  );
}