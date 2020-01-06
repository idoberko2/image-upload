# image-upload

[![Codecov Coverage](https://img.shields.io/codecov/c/github/idoberko2/image-upload/master.svg?style=flat-square)](https://codecov.io/gh/idoberko2/image-upload/)

## Running the app locally

1. Clone this repository
2. Run `yarn install`
3. Run `yarn start:dev`

## Testing

Run `yarn test`

## Environment variables

| Name                      | Type   | Default Value |
| ------------------------- | ------ | ------------- |
| RESIZE_PIXELS             | Number | 900           |
| MAX_CONCURRENT_UPLOADS    | Number | 30            |
| UPLOADS_FOLDER            | String | 'uploads'     |
| S3_ACCESS_KEY             | String | null          |
| S3_ACCESS_SECRET          | String | null          |
| S3_UPLOADS_BUCKET         | String | null          |
| S3_PUBLIC_PATH            | String | null          |
| DB_SERVICE_URL            | String | null          |

### Storage

The storage is determined by the S3\_\* variables. If all are set, the uploaded files will be sent there. Otherwise, it will be stored in `UPLOADS_FOLDER` (in the project's base path).

### DB_SERVICE_URL

The URL of the service that stores the information about the galleries. The upload will fail if this parameter is unset.
