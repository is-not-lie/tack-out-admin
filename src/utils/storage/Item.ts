import { MyStorage } from './Storage'
export class ObjStorage extends MyStorage<object> {
  constructor (key: string, storageType: string, val?: object) {
    if (val) super(key, storageType, val)
    else super(key, storageType)
  }

  getOne (index: string): any {
    const { val } = this
    return (val as any)[index]
  }

  setOne (index: string, newVal: any): void {
    const { val } = this;
    (val as any)[index] = newVal
    this.set(val)
  }

  delOne (index: string): void {
    const { val } = this
    delete (val as any)[index]
    this.set(val)
  }
}

export class ArrStorage extends MyStorage<any[]> {
  constructor (key: string, storageType: string, val?: any[]) {
    if (val) super(key, storageType, val)
    else super(key, storageType)
  }

  getOne (index: number): any {
    const { val } = this
    return val[index]
  }

  setOne (index: number, newVal: any): void {
    const { val } = this
    val.splice(index, 1, newVal)
    this.set(val)
  }

  delOne (index: number): void {
    const { val } = this
    val.splice(index, 1)
    this.set(val)
  }
}
