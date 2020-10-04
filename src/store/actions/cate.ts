import { http } from '@/api'
import { } from '@/typings/interface/request'

export const getCates = async ({ commit }: any) => {
  const cates = await http.reqCates()
  if (cates) commit('COMMIT', { key: 'cates', val: cates })
}

export const delCate = async ({ state }: any, _id: string) => {
  const result = await http.reqDelCate(_id)
  if (result) {
    const { cates } = state
    cates.splice(cates.findIndex((cate: { _id: string }) => cate._id === _id), 1)
  }
  return Promise.resolve()
}
