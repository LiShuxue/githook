const myShell = require('./myShell');
const logger = require('../utils/logger');

const dbBackupAndUpload = async () => {
  try {
    logger.info('DB-Backup automation job start...');
    await myShell.cd('/root/db-backup');
    // 数据库备份
    await myShell.exec('mongodump -h localhost:27017 -d journey -o /root/db-backup -u journey -p journey');

    // 数据库恢复
    // await myShell.exec('mongorestore -h localhost:27017 -d journey /root/db-backup/journey -u journey -p journey');

    // 压缩数据库备份文件
    await myShell.exec('zip -r journey-`date +%Y-%m-%d-%H-%M-%S`.zip journey');

    // 上传至七牛云
    logger.info('DB-Backup automation job successful.');
    return Promise.resolve();
  } catch (err) {
    logger.error('DB-Backup automation job failed.');
    return Promise.reject(err);
  }
}

module.exports = dbBackupAndUpload;