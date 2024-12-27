import crypto from 'crypto-js'
export function createJsonMd5(json = {}) {
  try {
    const content = JSON.stringify(json)
    return createMd5(content)
  } catch (error) {
    console.warn(error)
  }
  return null
}

export function createMd5(content = '') {
  return crypto.MD5(content).toString(crypto.enc.Hex)
}
