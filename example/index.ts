import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as serverless from '@pulumi/aws-serverless'
import * as epsagon from '@pulumi/epsagon'

// Load the Epsagon integration, you can optionally configure the Epsagon init
epsagon.install(pulumi, {appName: 'my-example'})

// Create a function
const hello = new aws.serverless.Function('my-function', {
    func: async (event, context) => {
        console.log(event)
        return {
            statusCode: 200,
            body: 'Hello world'
        }
    },
    policies: ['arn:aws:iam::aws:policy/AWSLambdaFullAccess']
})

// And an API providing an HTTP endpoint to call our function
const api = new serverless.apigateway.API('my-api', {
    routes: [
        {method: 'GET', path: '/hello', handler: hello.lambda}
    ]
})

// Create a bucket and a function to log new object uploads
const bucket = new aws.s3.Bucket('my-bucket')
serverless.bucket.onPut('onNewObject', bucket, async (ev) => console.log(ev))

exports.bucketName = bucket.bucket
