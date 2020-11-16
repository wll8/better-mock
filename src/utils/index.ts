/* type-coverage:ignore-next-line */
export const type = function (value: any): string {
  return isDef(value) 
    ? Object.prototype.toString.call(value).match(/\[object (\w+)\]/)![1].toLowerCase() 
    : String(value)
}

export const isDef = function (value: unknown): boolean {
  return value !== undefined && value !== null
}

export const isString = function (value: unknown): value is string {
  return type(value) === 'string'
}

export const isNumber = function (value: unknown): value is number {
  return type(value) === 'number'
}

export const isObject = function (value: unknown): value is object {
  return type(value) === 'object'
}

export const isArray = function<T = any> (value: unknown): value is Array<T> {
  return type(value) === 'array'
}

export const isRegExp = function (value: unknown): value is RegExp {
  return type(value) === 'regexp'
}

export const isFunction = function (value: unknown): value is Function {
  return type(value) === 'function'
}

export const keys = function (obj: object): string[] {
  const keys: string[] = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key)
    }
  }
  return keys
}

export const values = function (obj: object) {
  const values: any[] = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      values.push(obj[key])
    }
  }
  return values
}

/**
 * Mock.heredoc(fn)
 * 以直观、安全的方式书写（多行）HTML 模板。
 * http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript
 */
export const heredoc = function (fn: Function) {
  // 1. 移除起始的 function(){ /*!
  // 2. 移除末尾的 */ }
  // 3. 移除起始和末尾的空格
  return fn
    .toString()
    .replace(/^[^\/]+\/\*!?/, '')
    .replace(/\*\/[^\/]+$/, '')
    .replace(/^[\s\xA0]+/, '')
    .replace(/[\s\xA0]+$/, '') // .trim()
}

export const noop = function () {}

export const assert = function (condition: any, error: string) {
  if (!condition) {
    throw new Error('[better-mock] ' + error)
  }
}

/**
 * 创建一个自定义事件，兼容 IE
 * @param type 一个字符串，表示事件名称。
 * @param bubbles 一个布尔值，表示该事件能否冒泡。
 * @param cancelable 一个布尔值，表示该事件是否可以取消。
 * @param detail 一个任意类型，传递给事件的自定义数据。
 */
export const createCustomEvent = function<T = any> (type: string, bubbles = false, cancelable = false, detail?: T): CustomEvent<T> {
  try {
    return new CustomEvent<T>(type, { bubbles, cancelable, detail })
  } catch (e) {
    const event: CustomEvent<T> = document.createEvent('CustomEvent')
    event.initCustomEvent(type, bubbles, cancelable, detail!)
    return event
  }
}

/**
 * 同步执行异步函数, 入参和出参需要可序列化, 不会输出出参数之外的其他信息
 * @param fn 要运行的函数
 * @return {function} 接收原参数, 返回 {res, err}
 */
export function asyncTosync (fn) {
  return (...args) => {
    const { writeFileSync, readFileSync } = require(`fs`)
    const fnStr = fn.toString()
    const tempDir = (__dirname || require(`os`).tmpdir()).replace(/\\/g, `/`)
    const fileObj = {
      fnFile: createNewFile(tempDir, `fn.js`),
      resFile: createNewFile(tempDir, `res.log`),
      errFile: createNewFile(tempDir, `err.log`),
    }
    filesCreateOrRemove(fileObj, `create`)
    const argsString = args.map(arg => JSON.stringify(arg)).join(', ');
    const codeString = `
      const { writeFileSync } = require('fs')
      const fn = ${fnStr}
      new Promise(() => {
        fn(${argsString})
          .then((output = '') => {
            writeFileSync("${fileObj.resFile}", output, 'utf8')
          })
          .catch((error = '') => {
            writeFileSync("${fileObj.errFile}", error, 'utf8')
          })
        }
      )
    `
    writeFileSync(fileObj.fnFile, codeString, `utf8`)
    require(`child_process`).execSync(`"${process.execPath}" ${fileObj.fnFile}`)
    const res = readFileSync(fileObj.resFile, `utf8`)
    const err = readFileSync(fileObj.errFile, `utf8`)
    filesCreateOrRemove(fileObj, `remove`)
    return {res, err}
  }
}

/**
 * 根据 dirName 和 fileName 返回一个当前目录不存在的文件名
 * @param dirName 目录
 * @param fileName 名称
 * @return {stirng} 例 `${dirName}/temp_${Date.now()}.${fileName}`
 */
export function createNewFile (dirName, fileName) {
  const newFile = `${dirName}/temp_${Date.now()}.${fileName}`
  return require(`fs`).existsSync(newFile) === true ? createNewFile(dirName, fileName) : newFile
}

/**
 * 创建或删除一组文件
 * @param objOrArr {object|number} 要操作的内容
 * @param action {stirng} 操作方式 create remove
 */
export function filesCreateOrRemove (objOrArr, action) {
  const {writeFileSync, unlinkSync} = require('fs')
  Object.keys(objOrArr).forEach(key => {
    const name = objOrArr[key]
    if (action === `create`) {
      writeFileSync(name, ``, `utf8`)
    }
    if (action === `remove`) {
      unlinkSync(name)
    }
  })
}
