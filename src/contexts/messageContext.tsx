import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

interface Message {
  id: string;
  type: MessageType;
  message: string;
  duration?: number;
}

interface MessageContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const showMessage = useCallback((type: MessageType, message: string, duration: number = 4000) => {
    const id = generateId();
    const newMessage: Message = {
      id,
      type,
      message,
      duration
    };

    setMessages(prev => [...prev, newMessage]);

    // 自动移除消息
    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, duration);
    }
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const messageApi = {
    success: (message: string, duration?: number) => showMessage('success', message, duration),
    error: (message: string, duration?: number) => showMessage('error', message, duration),
    warning: (message: string, duration?: number) => showMessage('warning', message, duration),
    info: (message: string, duration?: number) => showMessage('info', message, duration),
    removeMessage,
    clearMessages,
  };

  const getMessageStyles = (type: MessageType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = (type: MessageType) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <MessageContext.Provider value={messageApi}>
      {children}
      
      {/* 消息容器 */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-sm w-full border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out ${getMessageStyles(message.type)}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(message.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {message.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => removeMessage(message.id)}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};