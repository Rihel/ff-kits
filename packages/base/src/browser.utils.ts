export function copy(text: string) {
  const textarea = document.createElement('textarea')
  document.body.appendChild(textarea)
  textarea.value = text
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

const cache = new Map<string, string>()
export function generateLetterAvatar(
  name: string,
  bgColor: string = '#1677ff',
) {
  const letter = name.slice(0, 1)?.toLocaleUpperCase() || 'U'
  if (cache.has(letter)) {
    return cache.get(letter)
  }

  const canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.fillStyle = bgColor

  ctx.fillRect(0, 0, 100, 100)
  ctx.fillStyle = '#fff'
  ctx.font = '60px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(letter, 50, 50)

  const url = canvas.toDataURL('image/png')
  cache.set(letter, url)
  return url
}
