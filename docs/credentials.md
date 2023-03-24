# AWS Credentials

To use the admin section of the app you will need to correctly set up your AWS credentials file by adding your research access key and secret key to your `~/.aws/credentials` file as below:

```
[research]
aws_access_key_id=<access key id>
aws_secret_access_key=<secret access key>
aws_session_token=<session token>
```

You can get the values for these from [AWS Apps Start](https://d-9367089bd8.awsapps.com/start#/) page, and click the "Command line or programmatic access" link[1]. That will open a dialog and you can copy/paste the keys from there [2].

Note the credentials profile may need to be modified to be `[research]` after you paste.

Reference: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html

[1] ![image](/uploads/7226e2e9598e3c46e72f19ada53d67bf/image.png)

[2] ![image](/uploads/a2964cbd8f712031a781b518e7cafbce/image.png)
