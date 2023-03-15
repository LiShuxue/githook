// 服务器端上传文件到七牛。客户端的上传参考journey项目

const qiniu = require('qiniu');
const logger = require('./logger');

// 鉴权对象
const accessKey = 'uHIW2IbsCKWoeaEW3x5tX6ajX3xL010MmmWar5vC';
const secretKey = 'BJzBW7iaoRMh370HdlWSI4gzjL9tbkn-J19uzedC';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const bucket = 'journey';

// 设置上传到的云空间的存储区域，华北
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z1;

// 获取上传凭证
const uploadToken = (keyToOverwrite) => {
  let options = {
    scope: bucket + ':' + keyToOverwrite, // 存储空间的Bucket名字+需要覆盖上传的文件
    expires: 1 * 60, // 上传凭证的过期时间，单位s
  };
  let putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};

// 文件上传
const fileUpload = (qiniuPath, sourceFilePath) => {
  logger.info('Start upload the image to Qiniuyun...');
  logger.info('qiniuPath: ' + qiniuPath);
  logger.info('sourceFilePath: ' + sourceFilePath);

  let formUploader = new qiniu.form_up.FormUploader(config);
  let putExtra = new qiniu.form_up.PutExtra();

  const fileName = qiniuPath.split('/').pop();

  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken(fileName), qiniuPath, sourceFilePath, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        logger.error('Upload failed!');
        logger.error(respErr);
        reject(respErr);
      }

      logger.info('Upload successful.');
      resolve({
        respBody,
        respInfo,
      });
    });
  });
};

module.exports = {
  fileUpload,
};
