interface storageInter<T> {
  key: string
  val: T
  storageType: string
  get: () => T
  set: (val: T) => void
  del: () => void
}

class AnyStorage implements storageInter<any> {
  key: string
  storageType: string
  val: any
  constructor(key: string, storageType: string, val?: any) {
    this.key = key
    this.storageType = storageType
    if (val) this.set(val)
    else this.val = this.get()
  }
  get(): any {
    const { storageType, key } = this
    switch (storageType) {
      case 'section':
        return JSON.parse(window.sessionStorage.getItem(key))
      default:
        return JSON.parse(window.localStorage.getItem(key))
    }
  }

  set(val: any): void {
    const { storageType, key } = this
    if (val) this.set(val)
    else this.val = this.get()
    switch (storageType) {
      case 'section':
        window.sessionStorage.setItem(key, val)
        break
      default:
        window.localStorage.setItem(key, val)
        break
    }
  }

  del(): void {
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

class ObjStorage implements storageInter<object> {
  key: string
  storageType: string
  val: object
  constructor(key: string, storageType: string, val?: object) {
    this.key = key
    this.storageType = storageType
    if (val) this.set(val)
    else this.val = this.get()
  }

  get(): object {
    const { storageType, key } = this
    switch (storageType) {
      case 'section':
        return JSON.parse(window.sessionStorage.getItem(key) || '{}')
      default:
        return JSON.parse(window.localStorage.getItem(key) || '{}')
    }
  }

  set(val: object): void {
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

  del(): void {
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

  getOne(index: string): any {
    const { val } = this
    return val[index]
  }

  setOne(index: string, newVal: any): void {
    const { val } = this
    val[index] = newVal
    this.set(val)
  }

  delOne(index: string): void {
    const { val } = this
    delete val[index]
    this.set(val)
  }
}

class ArrStorage implements storageInter<any[]> {
  key: string
  storageType: string
  val: any[]
  constructor(key: string, storageType: string, val?: any[]) {
    this.key = key
    this.storageType = storageType
    if (val) this.set(val)
    else this.val = this.get()
  }

  get(): any[] {
    const { storageType, key } = this
    switch (storageType) {
      case 'section':
        return JSON.parse(window.sessionStorage.getItem(key) || '[]')
      default:
        return JSON.parse(window.localStorage.getItem(key) || '[]')
    }
  }

  set(val: any[]): void {
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

  del(): void {
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

  getOne(index: number): any {
    const { val } = this
    return val[index]
  }

  setOne(index: number, newVal: any): void {
    const { val } = this
    val.splice(index, 1, newVal)
    this.set(val)
  }

  delOne(index: number): void {
    const { val } = this
    val.splice(index, 1)
    this.set(val)
  }
}

const _toString = Object.prototype.toString

const isObj = (target: any): boolean => _toString.call(target) === '[object Object]'

const isArr = (target: any): boolean => Array.isArray(target)

const isNull = (target: any): boolean => target === null

const isStr = (target: any): boolean => typeof target === 'string'

const isNumber = (target: any): boolean => typeof target === 'number'

const isUndefinde = (target: any): boolean => _toString.call(target) === '[object Undefined]'

const getValType = (val: any): string => {
  if (isObj(val)) return 'obj'
  if (isArr(val)) return 'arr'
  if (isNull(val)) return 'null'
  if (isStr(val)) return 'str'
  if (isNumber(val)) return 'number'
  if (isUndefinde(val)) return 'undefinde'
}

interface createStorage {
  key: string,
  storageType?: string,
  val?: any
}
export const createStorage = ({ key, storageType = 'local', val }: createStorage) => {
  switch (getValType(val)) {
    case 'obj':
      if (val) return new ObjStorage(key, storageType, val)
      else return new ObjStorage(key, storageType)
    case 'arr':
      if (val.length) return new ArrStorage(key, storageType, val)
      else return new ArrStorage(key, storageType)
    case 'undefinde':
      return new ObjStorage(key, storageType)
    default:
      return new AnyStorage(key, storageType, JSON.stringify(val))
  }
}