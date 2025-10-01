import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('加载中...');

  const setLoading = (loading: boolean, text: string = '加载中...') => {
    setIsLoading(loading);
    setLoadingText(text);
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      loadingText, 
      setLoading
    }}>
      {children}
      
      {/* 全局Loading遮罩 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-6 p-8 rounded-lg bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20">
            {/* 加载动画 */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            {/* 加载文字 */}
            <div className="text-white text-lg font-medium text-center max-w-xs text-shadow">
              {loadingText}
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};