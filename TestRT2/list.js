let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const translate = new AWS.Translate();
exports.handler = function (event, context, callback) {
	let response = {
		"isBase64Encoded": 1,
		"statusCode": 200,
		"headers": {
			"Access-Control-Allow-Origin": "*"
		},
		"body": "..."
	};

	let itemType = event.queryStringParameters.type;
	let language = event.queryStringParameters.lan;

	ddb.scan({
		TableName: 'TestRT2', ExpressionAttributeValues: { ':itemType': itemType }, FilterExpression: 'itemType = :itemType'
	}, function (err, data) {
		if (data && data.Items) {
			response.body = JSON.stringify(data.Items);
			callback(null, response);
		} else {
			response.statusCode = 404;
			response.body = "No items";
			callback(null, response);
		}
	});


}