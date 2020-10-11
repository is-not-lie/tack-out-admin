import { MyStorage } from './Storage'

export class ObjStorage extends MyStorage {
  constructor (key, type) {
    super(key, type)
    this.val = this.get()
  }

  getOne (index) {
    const { val } = this
    return val[index]
  }

  setOne (index, newVal) {
    const { val } = this
    val[index] = newVal
    this.set(val)
  }

  delOne (index) {
    const { val } = this
    delete val[index]
    this.set(val)
  }
}

export class ArrStorage extends MyStorage {
  constructor (key, type) {
    super(key, type)
    this.val = this.get()
  }

  getOne (index) {
    const { val } = this
    return val[index]
  }

  setOne (index, newVal) {
    const { val } = this
    val.splice(index, 1, newVal)
    this.set(val)
  }

  delOne (index) {
    const { val } = this
    val.splice(index, 1)
    this.set(val)
  }
}
