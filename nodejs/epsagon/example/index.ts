import * as pulumi from "@pulumi/pulumi"
import * as aws from "@pulumi/aws"
import * as serverless from "@pulumi/aws-serverless"
import * as epsagon from "@pulumi/epsagon"

// Load the Epsagon integration, you can optionally configure the Epsagon init
epsagon.install(pulumi, {appName: "my-example"})

// Create a bucket and a function to log new object uploads
const bucket = new aws.s3.Bucket("my-bucket")
serverless.bucket.onPut("onNewObject", bucket, async (ev) => console.log(ev))

exports.bucketName = bucket.bucket
