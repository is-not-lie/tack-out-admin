interface StorageInter<T> {
  key: string;
  val: T;
  storageType: string;
  get: () => T;
  set: (val: T) => void;
  del: () => void;
}

export class MyStorage<T> implements StorageInter<T> {
  key: string
  val!: T
  storageType: string

  constructor (key: string, storageType: string, val?: T) {
    this.key = key
    this.storageType = storageType
    if (val) this.set(val)
    else this.val = this.get()
  }

  get (): T {
    const { storageType, key } = this
    switch (storageType) {
      case 'section':
        return JSON.parse(window.sessionStorage.getItem(key) || '{}')
      default:
        return JSON.parse(window.localStorage.getItem(key) || '{}')
    }
  }

  set (val: T): void {
    const { storageType, key } = this
    this.val = val
    switch (storageType) {
      case 'section':
        window.sessionStorage.setItem(key, JSON.stringify(val))
        break
      default:
        window.localStorage.setItem(key, JSON.stringify(val))
        break
    }
  }

  del (): void {
    const { storageType, key } = this
    switch (storageType) {
      case 'section':
        window.sessionStorage.removeItem(key)
        break
      default:
        window.localStorage.removeItem(key)
        break
    }
  }
}
