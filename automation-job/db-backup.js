const myShell = require('./myShell');
const logger = require('../utils/logger');
const qiniuUtil = require('../utils/qiniuUtil');
const moment = require('moment');

const dbBackupAndUpload = async () => {
  try {
    logger.info('DB-Backup automation job start...');
    let dbBackupPath = '/root/db-backup/'
    await myShell.cd(dbBackupPath);
    // 数据库备份
    await myShell.exec('mongodump -h localhost:27017 -d journey -o /root/db-backup -u journey -p journey');

    // 数据库恢复
    // await myShell.exec('mongorestore -h localhost:27017 -d journey /root/db-backup/journey -u journey -p journey');

    // 压缩数据库备份文件
    let time = moment().format('YYYY-MM-DD-HH-mm-ss');
    let fileName = `DB-journey-${time}.zip`;
    await myShell.exec(`zip -r ${fileName} journey`);

    // 上传至七牛云
    let filePath = `${dbBackupPath}${fileName}`;
    await qiniuUtil.fileUpload(fileName, filePath);
    logger.info('DB-Backup automation job successful.');
    return Promise.resolve();
  } catch (err) {
    logger.error('DB-Backup automation job failed.');
    return Promise.reject(err);
  }
}

module.exports = dbBackupAndUpload;