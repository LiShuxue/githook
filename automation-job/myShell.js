const shell = require('shelljs');
const logger = require('../utils/logger');

const cd = (path) => {
  logger.info('cd to ' + path);

  return new Promise((resolve, reject) => {
    let result = shell.cd(path);
    if(result.code === 0) {
      logger.info('successful !');
      resolve(result.stdout);
    }
    if(result.code === 1) {
      logger.error('failed !');
      logger.error(result.stderr);
      reject(result.stderr);
    }
  }) 
}

const exec = (command) => {
  logger.info('exec: ' + command);

  return new Promise((resolve, reject) => {
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      if(code === 0) {
        logger.info('successful !');
        logger.info(stdout);
        resolve(stdout);
      }
      if(code === 1) {
        logger.error('failed !');
        logger.error(stderr);
        reject(stderr);
      }
    });
  }) 
}

const rm = (otpions, file) => {
  logger.info('rm: ' + file);

  return new Promise((resolve, reject) => {
    let result = shell.rm(otpions, file);
    if(result.code === 0) {
      logger.info('successful !');
      resolve(result.stdout);
    }
    if(result.code === 1) {
      logger.error('failed !');
      logger.error(result.stderr);
      reject(result.stderr);
    }
  }) 
}

const cp = (otpions, source, dest) => {
  logger.info('cp ' + otpions + ' : ' + source + ' to ' + dest);

  return new Promise((resolve, reject) => {
    let result = shell.cp(otpions, source, dest);
    if(result.code === 0) {
      logger.info('successful !');
      resolve(result.stdout);
    }
    if(result.code === 1) {
      logger.error('failed !');
      logger.error(result.stderr);
      reject(result.stderr);
    }
  }) 
}

module.exports = {
  cd,
  exec,
  rm,
  cp
}