// src/context.d.ts

import 'koishi';

// 扩展 Context 类型，添加 assets 属性
declare module 'koishi' {
  interface Context {
    assets: {
      get(key: string): Promise<Buffer | null>;
      put(key: string, value: Buffer): Promise<void>;
      delete(key: string): Promise<boolean>;
    };
  }
}