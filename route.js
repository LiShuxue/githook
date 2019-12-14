// 默认使用views文件下的 layout.html为布局文件。
// views文件夹下的其他为视图文件，用于渲染
// 视图文件会被渲染在某个布局文件里的{{{body}}}处。通过render方法
const logger = require('./utils/logger');

const journeyClientBuildAndDeploy = require('./automation-job/journey-client');
const journeyServerBuildAndDeploy = require('./automation-job/journey-server');
const vueAdminBuildAndDeploy = require('./automation-job/vue-admin');
const dbBackupAndUpload = require('./automation-job/db-backup');

let jobMap = new Map();
const setJobListAndStartRun = (name, handler) => {
  let job = {
    name: name,
    status: 'Running...',
    startTime: new Date(),
    endTime: null
  }
  jobMap.set(name, job);

  handler().then(()=> {
    job.status = 'Successful';
    job.endTime = new Date();
    jobMap.set(name, job);
  }).catch((err) => {
    job.status = 'Failed';
    job.endTime = new Date();
    job.failReason = err;
    jobMap.set(name, job);
  });
}

const route = (app) => {
  app.get('/', (req, res) => {
    res.render('home', { 
      jobList: Array.from(jobMap.values()),
    });
  });

  app.post('/journey-client', (req, res) => {
    logger.info('============================Received Git event trigger Journey-Client job==============================');
    if (req.headers['x-github-event'] === 'push') {
      setJobListAndStartRun('Journey-client', journeyClientBuildAndDeploy);
    }
    res.end();
  });

  app.post('/journey-server', (req, res) => {
    logger.info('============================Received Git event trigger Journey-Server job==============================');
    if (req.headers['x-github-event'] === 'push') {
      setJobListAndStartRun('Journey-server', journeyServerBuildAndDeploy);
    }
    res.end();
  });

  app.post('/vue-admin', (req, res) => {
    logger.info('============================Received Git event trigger Vue-Admin job==============================');
    if (req.headers['x-github-event'] === 'push') {
      setJobListAndStartRun('Vue-admin', vueAdminBuildAndDeploy);
    }
    res.end();
  });

  app.post('/db-backup', (req, res) => {
    logger.info('============================Received Git event trigger DB-Backup job==============================');
    if (req.headers['x-github-event'] === 'push') {
      setJobListAndStartRun('DB-Backup', dbBackupAndUpload);
    }
    res.end();
  });
}

module.exports = route;