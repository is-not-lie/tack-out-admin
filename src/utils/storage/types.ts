const _toString = Object.prototype.toString

const isObj = (target: any): boolean => _toString.call(target) === '[object Object]'

const isArr = (target: any): boolean => Array.isArray(target)

const isNull = (target: any): boolean => target === null

const isStr = (target: any): boolean => typeof target === 'string'

const isNumber = (target: any): boolean => typeof target === 'number'

const isUndefinde = (target: any): boolean => _toString.call(target) === '[object Undefined]'

export const getValType = (val: any): string => {
  if (isObj(val)) return 'obj'
  if (isArr(val)) return 'arr'
  if (isNull(val)) return 'null'
  if (isStr(val)) return 'str'
  if (isNumber(val)) return 'number'
  if (isUndefinde(val)) return 'undefinde'
}
