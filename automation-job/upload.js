const myShell = require('./myShell');
const logger = require('../utils/logger');
const qiniuUtil = require('../utils/qiniuUtil2');

const upload = async ({ project, fromPath }) => {
  try {
    logger.info('Upload automation job start...');
    let path = `/root/project/${project}`;
    await myShell.cd(path);
    await myShell.exec('git pull');
    // 上传至七牛云
    let filePath = `${path}${fromPath}`;
    await qiniuUtil.fileUpload(fromPath, filePath);
    logger.info('Upload automation job successful.');
    return Promise.resolve();
  } catch (err) {
    logger.error('Upload automation job failed.');
    return Promise.reject(err);
  }
};

module.exports = upload;
