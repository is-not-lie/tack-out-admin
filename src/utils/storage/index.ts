import { MyStorage } from './Storage'
import { ObjStorage, ArrStorage } from './Item'
import { getValType } from './types'
// storage 类型
type storage = ObjStorage | ArrStorage | MyStorage<any>
// 存储已创建 storage 数组接口
interface Storages {
  key: string;
  storageType: string;
  storage: storage;
}
// 创建 storage 函数参数接口
interface CreateStorage {
  key: string;
  storageType?: string;
  val?: any;
}
// 存储已创建的 storage
const storages: Array<Storages> = []

// 创建 storage 的函数
export const createStorage = ({ key, storageType = 'local', val }: CreateStorage): storage => {
  const index = storages.findIndex(item => item.key === key && item.storageType === storageType)
  if (index !== -1) return storages[index].storage

  let storage: storage

  switch (getValType(val)) {
    case 'obj':
      storage = val
        ? new ObjStorage(key, storageType, val)
        : new ObjStorage(key, storageType)
      storages.push({ key, storageType, storage })
      break
    case 'arr':
      storage = val
        ? new ArrStorage(key, storageType, val)
        : new ArrStorage(key, storageType)
      storages.push({ key, storageType, storage })
      break
    case 'undefinde':
      storage = new ObjStorage(key, storageType)
      storages.push({ key, storageType, storage })
      break
    default:
      storage = new MyStorage<any>(key, storageType, val)
      storages.push({ key, storageType, storage })
      break
  }

  return storage
}
