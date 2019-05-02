// external
const AWS = require('aws-sdk');

function generateStorageFunction(
    S3_ACCESS_KEY,
    S3_ACCESS_SECRET,
    S3_UPLOADS_BUCKET,
    S3_PUBLIC_PATH,
    customUploader = null
) {
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_ACCESS_SECRET,
    });

    return async function storeExternally(
        image,
        collection,
        fileName,
        { mimetype }
    ) {
        const path = `${collection}/${fileName}`;
        /* istanbul ignore next */
        const uploadFunction =
            customUploader ||
            ((path, image) =>
                s3
                    .upload({
                        Bucket: S3_UPLOADS_BUCKET,
                        Key: path,
                        Body: image,
                        ContentType: mimetype,
                    })
                    .promise());

        await uploadFunction(path, image);

        return `${S3_PUBLIC_PATH}/${path}`;
    };
}

module.exports = generateStorageFunction;
