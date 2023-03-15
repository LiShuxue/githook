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
const uploadToken = () => {
  let options = {
    scope: bucket, // 存储空间的Bucket名字
    expires: 1 * 60, // 上传凭证的过期时间，单位s
  };
  let putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};

// 文件上传
const fileUpload = (fileName, filePath) => {
  logger.info('Start upload the db to Qiniuyun...');
  logger.info('fileName: ' + fileName);
  logger.info('filePath: ' + filePath);

  let key = 'blog/image/' + fileName;
  let formUploader = new qiniu.form_up.FormUploader(config);
  let putExtra = new qiniu.form_up.PutExtra();

  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken(), key, filePath, putExtra, (respErr, respBody, respInfo) => {
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
