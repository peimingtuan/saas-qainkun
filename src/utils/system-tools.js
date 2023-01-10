import { System, Crypto } from 'persagytools'

// 加密类
export const crypto = new Crypto({
  key: '1234123412ABCDEF',
  iv: 'ABCDEF1234123412'
})

// 系统类
export const system = new System({
  key: '1234123412ABCDEF',
  iv: 'ABCDEF1234123412'
})
