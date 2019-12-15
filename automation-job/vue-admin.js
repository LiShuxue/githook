const myShell = require('./myShell');
const logger = require('../utils/logger');

const vueAdminBuildAndDeploy = async () => {
  try {
    logger.info('Vue-admin automation job start...');
    await myShell.cd('/root/project/vue-admin');
    await myShell.exec('git checkout .');
    await myShell.exec('git pull');
    await myShell.exec('yarn');
    await myShell.exec('yarn build-prod');
    // await myShell.rm('-rf', '/root/project/vue-admin/*');
    // await myShell.cp('-r', 'dist/*', '/root/project/vue-admin/');
    await myShell.exec('nginx -s reload');
    logger.info('Vue-admin automation job successful.');
    return Promise.resolve();
  } catch (err) {
    logger.error('Vue-admin automation job failed.');
    return Promise.reject(err);
  }
}

// // testing
// const vueAdminBuildAndDeploy = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(()=> {
//       resolve('faildasdf;ajsdf;jads;fja;sdjf;ajsdf;ja;sdjfa;djsf;ahsfuqyetqrqp ');
//     }, 1000 * 10);
//   })
// }

module.exports = vueAdminBuildAndDeploy;
