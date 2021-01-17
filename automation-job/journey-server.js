const myShell = require('./myShell');
const logger = require('../utils/logger');

const journeyServerBuildAndDeploy = async () => {
  try {
    logger.info('Journey-server automation job start...');
    await myShell.cd('/root/project/journey/journey-server');
    await myShell.exec('git checkout .');
    await myShell.exec('git pull');
    await myShell.exec('yarn --ignore-engines');
    await myShell.exec('yarn re-start');
    await myShell.exec('nginx -s reload');
    logger.info('Journey-server automation job successful.');
    return Promise.resolve();
  } catch (err) {
    logger.error('Journey-server automation job failed.');
    return Promise.reject(err);
  }
};

module.exports = journeyServerBuildAndDeploy;
