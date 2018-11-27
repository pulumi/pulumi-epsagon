# Pulumi Epsagon integration

This package provides [Epsagon](https://epsagon.com/) integration with [Pulumi](https://www.pulumi.com/) programs. When imported into a Pulumi program, any serverless functions generated from JavaScript callbacks in the Pulumi program will automatically be wrapped with Epsagon Lambda Wrapper.

```javascript
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");

// Load the Pulumi Epsagon integration package
const epsagon = require("@pulumi/epsagon");
epsagon.install(pulumi, { appName: "my-example" });

// Create a bucket and a function to log new object uploads
const bucket = new aws.s3.Bucket("my-bucket");
bucket.onObjectCreated("onNewObject", async (ev) => console.log(ev));
exports.bucketName = bucket.bucket;
```

## Configuration

After importing `@pulumi/epsagon` into a Pulumi program, you will need to provide an Epsagon token via a Pulumi configuration secret.  You can get your token on the "Install" page of the Epsagon console for your project.

```bash
$ pulumi config set --secret epsagon:token <your token here>
```