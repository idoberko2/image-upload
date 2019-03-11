# image-upload

## Running the app

1. Clone this repository
2. Run `yarn install`
3. Run `yarn start`

## Environment variables

| Name              | Type   | Default Value |
| ----------------- | ------ | ------------- |
| RESIZE_PIXELS     | Number | 900           |
| SEASON            | String | calculated    |
| UPLOADS_FOLDER    | String | 'uploads'     |
| WMP_DOMAIN        | String | null          |
| WMP_APPID         | String | null          |
| WMP_SHARED_SECRET | String | null          |

### Storage

The storage is determined by the WMP\_\* variables. If all are set, the uploaded files will be sent there. Otherwise, it will be stored in `UPLOADS_FOLDER` (in the project's base path).

### Season

If the SEASON environment variable is set, this will be used to determine the current season.

If not, it will be calculated using the threshold of July 10th.
