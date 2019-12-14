const log4js = require('log4js');

log4js.configure({
  // 配置打印输出源
  appenders: {
    file: { 
      type: 'file', // 日志打印在文件中
      filename: 'output.log', // 文件名
      maxLogSize: 1024 * 1024 * 5  // 日志文件大小限制： 1024byte * 1024 * 5 = 5M，日志超过这个大小后会生成新的日志文件
    },
    console: { 
      type: 'console' // 日志打印在控制台
    }
  },

  // logger分类，如log4js.getLogger('dev')
  // log级别从低到高：ALL < MARK < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF
  // 定义了日志级别以后，只有这个级别或者这个级别以上的日志会被打印
  categories: {
    dev: {
      appenders: ['console'],
      level: 'trace'
    },
    prd: {
      appenders: ['file'],
      level: 'trace'
    },
    default: { // 必须配置，不然报错
      appenders: ['console'],
      level: 'all'
    }
  }
});

let logger = log4js.getLogger('dev');

if (process.env.NODE_ENV === 'production') {
  logger = log4js.getLogger('prd');
}

module.exports = logger;