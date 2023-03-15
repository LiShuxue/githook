const logger = require('../utils/logger');

const journeyClientBuildAndDeploy = require('./journey-client');
const journeyServerBuildAndDeploy = require('./journey-server');
const dbBackupAndUpload = require('./db-backup');
const upload = require('./upload');

let jobHandlerMapping = {
  'Journey-Client': journeyClientBuildAndDeploy,
  'Journey-Server': journeyServerBuildAndDeploy,
  'DB-Backup': dbBackupAndUpload,
  Upload: upload,
};

/*********** Bellow code is for testing purpose ************/
if (process.env.LOG_ENV !== 'production') {
  const testingBuildPortal = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // resolve();
        reject('error reason');
      }, 1000 * 10);
    });
  };
  jobHandlerMapping = {
    'Journey-Client': testingBuildPortal,
    'Journey-Server': testingBuildPortal,
    'DB-Backup': testingBuildPortal,
    Upload: testingBuildPortal,
  };
}
/*********** Upon code is for testing purpose ************/

// let allJob = [{
//   name: 'Journey-Client',
//   isRunning: false,
//   jobList: [{
//     name: 'Journey-Client',
//     buildNo: '1',
//     status: 'Successful',
//     startTime: new Date(),
//     endTime: new Date()
//   }, {
//     name: 'Journey-Client',
//     buildNo: '2',
//     status: 'Failed',
//     startTime: new Date(),
//     endTime: new Date(),
//     failReason: 'test'
//   }, {
//     name: 'Journey-Client',
//     buildNo: '3',
//     status: 'Running',
//     startTime: new Date(),
//     endTime: null
//   }, {
//     name: 'Journey-Client',
//     buildNo: '4',
//     status: 'Pending',
//     startTime: null,
//     endTime: null
//   }]
// }, {
//   name: 'Journey-Server',
//   isRunning: false,
//   jobList: [{
//     name: 'Journey-Server',
//     buildNo: '1',
//     status: 'Successful',
//     startTime: new Date(),
//     endTime: new Date()
//   }, {
//     name: 'Journey-Server',
//     buildNo: '2',
//     status: 'Failed',
//     startTime: new Date(),
//     endTime: new Date(),
//     failReason: 'test'
//   }, {
//     name: 'Journey-Server',
//     buildNo: '3',
//     status: 'Running',
//     startTime: new Date(),
//     endTime: null
//   }, {
//     name: 'Journey-Server',
//     buildNo: '4',
//     status: 'Pending',
//     startTime: null,
//     endTime: null
//   }]
// }]

let allJob = [];
const createJob = (name, args) => {
  logger.info('Start create job: ' + name);

  let buildNo;

  // 从所有的Job中找出当前类别的job对象
  let jobObject = allJob.filter((value) => {
    return value.name === name;
  });

  // 如果没有找到就创建
  if (jobObject.length > 0) {
    jobObject = jobObject[0];
    // 初始化buildNo为上一个job + 1
    let lastJob = jobObject.jobList.length > 0 && jobObject.jobList[jobObject.jobList.length - 1];
    buildNo = lastJob.buildNo + 1;
  } else {
    jobObject = {
      name,
      isRunning: false,
      jobList: [],
    };
    // 新建的初始化为0
    buildNo = 0;
    allJob.push(jobObject);
  }

  // 初始化一个job
  let job = {
    name: jobObject.name,
    buildNo,
    status: 'Pending',
    startTime: null,
    endTime: null,
    failReason: null,
    args,
  };

  logger.info('Job ' + job.name + ' created successful, buildNo: ' + job.buildNo);

  // 放到当前job类别的list中
  jobObject.jobList.push(job);

  // 循环check当前的job是否执行
  loopCheckJobStatus(jobObject, job);
};

const excuteJob = (jobObject, job, isRebuild) => {
  let msg = isRebuild ? 're-run' : 'excute';
  logger.info('Start ' + msg + ' the job, name: ' + job.name + ' buildNo: ' + job.buildNo);

  job.startTime = new Date();
  job.endTime = null;
  job.failReason = null;
  job.status = isRebuild ? 'Re-Running' : 'Running';
  jobObject.isRunning = true;

  // 拿到当前job的执行方法
  let handler = jobHandlerMapping[jobObject.name];

  handler(job.args)
    .then(() => {
      logger.info(job.name + ' job, buildNo ' + job.buildNo + ' ' + msg + ' succcessful');
      job.status = 'Successful';
      job.endTime = new Date();
      jobObject.isRunning = false;
    })
    .catch((err) => {
      logger.info(job.name + ' job, buildNo ' + job.buildNo + ' ' + msg + ' failed');
      logger.error(err);

      job.status = 'Failed';
      job.endTime = new Date();
      job.failReason = err;
      jobObject.isRunning = false;
    });
};

const loopCheckJobStatus = (jobObject, job, isRebuild) => {
  // 如果有job正在进行中，就等待10秒再去check
  if (jobObject.isRunning) {
    logger.info('There have a job is running, job ' + job.buildNo + ' is waiting.');
    setTimeout(() => {
      loopCheckJobStatus(jobObject, job, isRebuild);
    }, 10 * 1000);
    return;
  }

  logger.info('Execute the ' + jobObject.name + ' job, buildNo: ' + job.buildNo);
  excuteJob(jobObject, job, isRebuild);
};

module.exports = {
  allJob,
  createJob,
  loopCheckJobStatus,
};
