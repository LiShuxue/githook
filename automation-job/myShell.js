const shell = require('shelljs');

const cd = (path) => {
  return new Promise((resolve, reject) => {
    let result = shell.cd(path);
    if(result.code === 0) {
      resolve(result.stdout);
    }
    if(result.code === 1) {
      reject(result.stderr);
    }
  }) 
}

const exec = (command) => {
  return new Promise((resolve, reject) => {
    shell.exec(command, (code, stdout, stderr) => {
      if(code === 0) {
        resolve(stdout);
      }
      if(code === 1) {
        reject(stderr);
      }
    });
  }) 
}

const rm = (otpions, file) => {
  return new Promise((resolve, reject) => {
    let result = shell.rm(otpions, file);
    if(result.code === 0) {
      resolve(result.stdout);
    }
    if(result.code === 1) {
      reject(result.stderr);
    }
  }) 
}

const cp = (otpions, source, dest) => {
  return new Promise((resolve, reject) => {
    let result = shell.cp(otpions, source, dest);
    if(result.code === 0) {
      resolve(result.stdout);
    }
    if(result.code === 1) {
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