let AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();
let validateJS = require("validate.js");
exports.handler = function (event, context, callback) {

	let validation = validateJS(event, {
		itemCode: { presence: true, length: { minimum: 3 } },
		itemPrice: { numericality: true }
	});

	if (validation) {
		callback(JSON.stringify(validation), null);
	}

	let image = Buffer.from(event.itemImage, "base64");

	ddb.put({
		TableName: 'TestRT2',
		Item: {
			'itemCode': event.itemCode, 'itemName': event.itemName, 'itemPrice': event.itemPrice, 'itemType': event.itemType
		}
	}, function (err, data) {
		if (!err) {
			let objectKey = event.itemCode + ".jpg";

			s3.putObject({
				"Body": image,
				"Bucket": "testrt2.images",
				"Key": objectKey,
				"ACL": "public-read"
			})
				.promise()
				.then(data => {
					callback(null, "Successfully persisted");
				})
				.catch(err => {
					callback(err, null);
				});
		} else {
			callback(err, null);
		}


	});
}