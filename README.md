#exif_s3_indexer
An HTTP API with flexible EXIF parsing and indexing capabilities.

## Routes

* `/exif` - Get list of images available for EXIF information (includes href pointing to endpoint for this API.)

* `/exif/:key` - Get EXIF data from an image.

* `/exif/:key/:attr` - Get a specific EXIF attributes value. Supports `.` or `/` notation in terms of accessing nested attributes. Ex. `/exif/imagekey/Image/make` or `/exif/imagekey/Image.make` returns `NIKON`.

## Commands

* `npm start` - start the API server.
* `npm run initdb` - Fully index into the DB from the S3 bucket, and start the API server.
