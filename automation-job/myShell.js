const shell = require('shelljs');
const logger = require('../utils/logger');

const cd = (path) => {
  return new Promise((resolve, reject) => {
    let result = shell.cd(path);
    if(result.code === 0) {
      logger.info('cd to ' + path);
      resolve(result.stdout);
    }
    if(result.code === 1) {
      logger.error(result.stderr);
      reject(result.stderr);
    }
  }) 
}

const exec = (command) => {
  return new Promise((resolve, reject) => {
    shell.exec(command, (code, stdout, stderr) => {
      logger.info('exec: ' + command);
      if(code === 0) {
        logger.info(stdout);
        resolve(stdout);
      }
      if(code === 1) {
        logger.error(stderr);
        reject(stderr);
      }
    });
  }) 
}

const rm = (otpions, file) => {
  return new Promise((resolve, reject) => {
    let result = shell.rm(otpions, file);
    if(result.code === 0) {
      logger.info('rm: ' + file);
      resolve(result.stdout);
    }
    if(result.code === 1) {
      logger.error(result.stderr);
      reject(result.stderr);
    }
  }) 
}

const cp = (otpions, source, dest) => {
  return new Promise((resolve, reject) => {
    let result = shell.cp(otpions, source, dest);
    if(result.code === 0) {
      logger.info('cp ' + otpions + ' : ' + source + ' to ' + dest);
      resolve(result.stdout);
    }
    if(result.code === 1) {
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