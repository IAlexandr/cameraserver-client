var aws = require('aws-sdk');
var s3blobs = require('s3-blob-store');

function checkS3Store(props) {
  const {
    accessKeyId,
    secretAccessKey,
    endpoint,
    bucket
  } = props.s3;

  return new Promise((resolve) => {
    const client = new aws.S3({
      accessKeyId,
      secretAccessKey,
      endpoint: new aws.Endpoint(endpoint),
    });

    const store = s3blobs({
      client: client,
      bucket
    });

    props.connections.store = store;

    return resolve(props);
  });
}

module.exports = checkS3Store;
