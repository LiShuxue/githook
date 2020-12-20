const myShell = require('./myShell');
const logger = require('../utils/logger');

const vueAdminBuildAndDeploy = async () => {
  try {
    logger.info('Vue-admin automation job start...');
    // 先关闭一些服务来腾出内存， 关闭后台服务，关闭MongoDB服务
    await myShell.exec('mongod --shutdown');
    await myShell.exec('pm2 stop journey-server');

    await myShell.cd('/root/project/vue-admin');
    await myShell.exec('git checkout .');
    await myShell.exec('git pull');
    await myShell.exec('yarn --ignore-engines');
    await myShell.exec('yarn build-prod');
    // await myShell.rm('-rf', '/root/project/vue-admin/*');
    // await myShell.cp('-r', 'dist/*', '/root/project/vue-admin/');

    // 再重启刚才关闭的服务。后台服务，MongoDB服务
    await myShell.exec('mongod -f /data/db/mongodb.cnf');
    await myShell.exec('pm2 start journey-server');
    
    await myShell.exec('nginx -s reload');
    logger.info('Vue-admin automation job successful.');
    return Promise.resolve();
  } catch (err) {
    logger.error('Vue-admin automation job failed.');
    return Promise.reject(err);
  }
}

module.exports = vueAdminBuildAndDeploy;
