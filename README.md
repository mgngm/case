# Tesseract

## Getting Started

First, install dependencies

```bash
npm ci
```

Next, pull the amplify environmemt

```bash
amplify pull --appId $appId --envName $env
```

where `$appId` is the amplify ID and `$env` is the name of the amplify environment you wish to use. 9 times out of 10 this will be either `dev` (on research) or `develop` (on tesseract development).

Then you're ready to run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

You can log into the app with your SSO credentials (talk to IntSys to add you to the appropriate AD group).

## Useful Info

- [Managing credentials](docs/credentials.md)
- [Amplify environments](docs/env.md)
- [Merging environments](docs/merging.md)

- [NextJS docs](https://nextjs.org/docs/getting-started)
- [Amplify lib docs](https://docs.amplify.aws/lib/q/platform/js/)
- [Amplify cli docs](https://docs.amplify.aws/cli/)
- [AWS SDK docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)
