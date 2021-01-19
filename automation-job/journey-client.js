const myShell = require('./myShell');
const logger = require('../utils/logger');

const journeyClientBuildAndDeploy = async () => {
  try {
    logger.info('Journey-client automation job start...');

    // 先关闭一些服务来腾出内存， 关闭后台服务，关闭MongoDB服务
    await myShell.exec('mongod --shutdown');
    await myShell.exec('pm2 stop journey-server');
    await myShell.exec('nginx -s stop');

    await myShell.cd('/root/project/journey/journey-client');
    await myShell.exec('git checkout .');
    await myShell.exec('git pull');
    await myShell.exec('yarn --ignore-engines');
    await myShell.exec('yarn build-prd');
    await myShell.rm('-rf', 'dist/js/*.map');
    // 更新nginx
    await myShell.cp('-r', 'nginx/nginx.conf', '/etc/nginx/nginx.conf');
    // await myShell.rm('-rf', '/root/project/journey/journey-client/*');
    // await myShell.cp('-r', 'dist/*', '/root/project/journey/journey-client/');

    // 再重启刚才关闭的服务。后台服务，MongoDB服务
    await myShell.exec('mongod -f /data/db/mongodb.cnf');
    await myShell.exec('pm2 start journey-server');
    await myShell.exec('nginx -c /etc/nginx/nginx.conf');

    logger.info('Journey-client automation job successful.');
    return Promise.resolve();
  } catch (err) {
    logger.error('Journey-client automation job failed.');
    try {
      // 失败后重启刚才关闭的服务。
      await myShell.exec('mongod -f /data/db/mongodb.cnf');
      await myShell.exec('pm2 start journey-server');
      await myShell.exec('nginx -c /etc/nginx/nginx.conf');
      logger.info('Re-start the service successful.');
    } catch (err) {
      logger.error('Re-start the service failed.');
    }
    return Promise.reject(err);
  }
};

module.exports = journeyClientBuildAndDeploy;
