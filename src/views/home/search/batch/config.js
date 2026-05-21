export const STATUS = [
  {
    value: 0,
    text: '等待扫描',
    class: 'text-regular',
    percentage: 10
  },
  {
    value: 1,
    text: '扫描中',
    class: 'text-primary',
    percentage: 40
  },
  {
    value: 2,
    text: '扫描完成',
    class: 'text-success',
    percentage: 100
  },
  {
    value: 3,
    text: '出错结束',
    class: 'text-danger',
    percentage: 100
  }
]

export const getStatus = (status) => {
  if (status || status === 0) {
    const currentRow = STATUS.find(item => item.value === status)
    return currentRow || {}
  } else {
    return {}
  }
}
