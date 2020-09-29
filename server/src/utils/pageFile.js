module.exports = (arr, pageNum, pageSize) => {
  // 字符串转数值
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = (start + pageSize) <= total ? (start + pageSize) : total
  const list = []
  for (let i = start; i < end; i++) { list.push(arr[i]) }
  return { pageNum, total, pages, pageSize, list }
}
