// postcss的配置文件 将写入的px单位自动转换为rem 自适应移动端分辨率
// postcss是基于node.js运行的一个处理css的工具  所以它的配置文件是运行在node.js中的
module.exports = {
  // 配置要导出的相关插件
  plugins: {
    // 自动添加浏览器厂商声明前缀 用来兼容不同的浏览器
    // 由于cli已经在内部配置了autoprefixer 这里不需要在配置了 只要将下面的系统要求放到.browserslistrc文件中就行
    /* autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8'],
    }, */
    // 将px转成rem
    'postcss-pxtorem': {
      // 转换的根元素的基准值
      // 375宽的设计稿 基准值 375 / 10 = 37.5
      rootValue: 37.5,

      // 需要转换的css属性  *代表所有属性
      propList: ['*']
    }
  }
}
