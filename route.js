// 默认使用views文件下的 layout.html为布局文件。
// views文件夹下的其他为视图文件，用于渲染
// 视图文件会被渲染在某个布局文件里的{{{body}}}处。通过render方法
const logger = require('./utils/logger');
const jobManager = require('./automation-job/job-manager');
const fs = require('fs');

const route = (app) => {
  app.get('/', (req, res) => {
    res.render('home', {
      allJob: jobManager.allJob,
    });
  });

  app.get('/detail/:name/:buildNo', (req, res) => {
    let name = req.params.name;
    let buildNo = req.params.buildNo;

    let jobObject = jobManager.allJob.filter((value) => {
      return value.name === name;
    });
    let job = jobObject[0].jobList.filter((value) => {
      return value.buildNo === parseInt(buildNo);
    });

    res.render('detail', {
      job: job[0],
    });
  });

  app.get('/rebuild/:name/:buildNo', (req, res) => {
    let name = req.params.name;
    let buildNo = req.params.buildNo;

    let jobObject = jobManager.allJob.filter((value) => {
      return value.name === name;
    })[0];
    let job = jobObject.jobList.filter((value) => {
      return value.buildNo === parseInt(buildNo);
    })[0];

    job.status = 'Waiting re-running';
    jobManager.loopCheckJobStatus(jobObject, job, true);
    res.redirect('/');
  });

  app.get('/log', (req, res) => {
    let data = '';
    if (process.env.LOG_ENV === 'production') {
      data = fs.readFileSync('/root/githook/output.log', 'utf-8');
    } else {
      data = fs.readFileSync('./output.log', 'utf-8');
    }

    res.write(data.toString());
  });

  app.post('/journey-client', (req, res) => {
    if (
      req.headers['x-github-event'] === 'push' &&
      req.body.pusher.name !== 'dependabot[bot]' &&
      req.body.ref.includes('master')
    ) {
      logger.info(
        '============================Received Git event trigger Journey-Client job=============================='
      );
      jobManager.createJob('Journey-Client');
    }
    res.end();
  });

  app.post('/journey-server', (req, res) => {
    if (
      req.headers['x-github-event'] === 'push' &&
      req.body.pusher.name !== 'dependabot[bot]' &&
      req.body.ref.includes('master')
    ) {
      logger.info(
        '============================Received Git event trigger Journey-Server job=============================='
      );
      jobManager.createJob('Journey-Server');
    }
    res.end();
  });

  app.post('/db-backup', (req, res) => {
    if (
      req.headers['x-github-event'] === 'push' &&
      req.body.pusher.name !== 'dependabot[bot]' &&
      req.body.ref.includes('master')
    ) {
      logger.info('============================Received Git event trigger DB-Backup job==============================');
      jobManager.createJob('DB-Backup');
    }
    res.end();
  });

  app.post('/upload', (req, res) => {
    const { project, fromPath } = req.body;
    if (project === 'blog-article' || 'resume') {
      logger.info(
        `============================Trigger UploadImage job, ${project}, ${fromPath}==============================`
      );
      jobManager.createJob('UploadImage', {
        project,
        fromPath,
      });
    }
    res.end();
  });

  /*********** Bellow code is for testing purpose ************/
  if (process.env.LOG_ENV !== 'production') {
    app.get('/journey-client', (req, res) => {
      jobManager.createJob('Journey-Client');
      res.end();
    });

    app.get('/journey-server', (req, res) => {
      jobManager.createJob('Journey-Server');
      res.end();
    });

    app.get('/db-backup', (req, res) => {
      jobManager.createJob('DB-Backup');
      res.end();
    });
  }
  /*********** Upon code is for testing purpose ************/
};

module.exports = route;
