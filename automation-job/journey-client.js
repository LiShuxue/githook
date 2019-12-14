const myShell = require('./myShell');

const journeyClientBuildAndDeploy = async () => {
  try {
    console.log('Journey-client automation job start...');
    await myShell.cd('/root/.jenkins/workspace/journey-client');
    await myShell.exec('git checkout .');
    await myShell.exec('git pull');
    await myShell.exec('yarn');
    await myShell.exec('yarn build-prd');
    await myShell.rm('-rf', '/root/project/journey/journey-client/*');
    await myShell.cp('-r', 'dist/*', '/root/project/journey/journey-client/');
    await myShell.exec('nginx -s reload');
    console.log('Journey-client automation job successful.');
    return Promise.resolve();
  } catch (err) {
    console.log(err)
    console.log('Journey-client automation job failed.');
    return Promise.reject(err);
  }
}

// // testing
// const journeyClientBuildAndDeploy = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(()=> {
//       resolve('faildasdf;ajsdf;jads;fja;sdjf;ajsdf;ja;sdjfa;djsf;ahsfuqyetqrqp ');
//     }, 1000 * 10);
//   })
// }

module.exports = journeyClientBuildAndDeploy;

