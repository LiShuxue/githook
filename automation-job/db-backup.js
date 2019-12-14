const myShell = require('./myShell');

const dbBackupAndUpload = async () => {
  try {
    console.log('DB-Backup automation job start...');
    await myShell.cd('/root/db-backup');
    // 数据库备份
    await myShell.exec('mongodump -h localhost:27017 -d journey -o /root/db-backup');

    // 数据库恢复
    // await myShell.exec('mongorestore -h localhost:27017 -d journey /root/db-backup/journey');

    // 压缩数据库备份文件
    await myShell.exec('zip -r journey-`date +%Y-%m-%d-%H-%M-%S`.zip journey');

    // 上传至七牛云
    console.log('DB-Backup automation job successful.');
    return Promise.resolve();
  } catch (err) {
    console.log(err)
    console.log('DB-Backup automation job failed.');
    return Promise.reject(err);
  }
}

// // testing
// const dbBackupAndUpload = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(()=> {
//       resolve();
//     }, 1000 * 15);
//   })
// }

module.exports = dbBackupAndUpload;