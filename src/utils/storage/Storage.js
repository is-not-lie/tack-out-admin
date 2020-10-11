export class MyStorage {
  constructor (key, type) {
    this.key = key
    this.type = type
  }

  get () {
    const { type, key } = this
    switch (type) {
      case 'section':
        return JSON.parse(window.sessionStorage.getItem(key) || null)
      default:
        return JSON.parse(window.localStorage.getItem(key) || null)
    }
  }

  set (val) {
    const { type, key } = this
    this.val = val
    switch (type) {
      case 'section':
        window.sessionStorage.setItem(key, JSON.stringify(val))
        break
      default:
        window.localStorage.setItem(key, JSON.stringify(val))
        break
    }
  }

  del () {
    const { type, key } = this
    switch (type) {
      case 'section':
        window.sessionStorage.removeItem(key)
        break
      default:
        window.localStorage.removeItem(key)
        break
    }
    this.val = null
  }
}
