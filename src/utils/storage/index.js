import { MyStorage } from './Storage'
import { ObjStorage, ArrStorage } from './Item'

// 存储已创建的 storage
const storages = []

// 创建 storage 的函数
export const createStorage = ({ key, type = 'obj', storageType = 'local' }) => {
  const index = storages.findIndex(item => item.key === key && item.storageType === storageType)
  if (index !== -1) return storages[index].storage

  let storage

  switch (type) {
    case 'str':
      storage = new MyStorage(key, storageType)
      break
    case 'arr':
      storage = new ArrStorage(key, storageType)
      break
    default:
      storage = new ObjStorage(key, storageType)
      break
  }

  storages.push({ key, storageType, storage })

  return storage
}
