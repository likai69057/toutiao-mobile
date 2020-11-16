// 本地存储封装模块

export const getItem = (name) => {
  const data = window.localStorage.getItem(name)
  // 因为本地存储的可能不是JSON格式的字符串
  try {
    // 将本地存储的Json格式的字符串转换成对象
    return JSON.parse(data)
  } catch (error) {
    // data不是JSON格式的字符串时
    return data
  }
}

export const setItem = (name, value) => {
  // 先判断value是否是对象
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = (name) => {
  window.localStorage.removeItem(name)
}
