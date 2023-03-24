# Amplify Environments

## New env setup

```bash
amplify add env <env name>
```

```bash
amplify remove custom
```

**note:** also had to remove and re-create storage:

```bash
amplify remove storage
amplify add storage
# (files, auth access only, CRUD rights, no lambdas)
```

```bash
amplify push
```

```bash
amplify add custom
# (cloudformation, access all resources)
```

copy another custom resources file over, and add new envs resources and roles (remove existing if on a different profile)

```bash
amplify push
```

edit `.gitlab-ci.yml` to enable publish job

create branch on gitlab.com

connect everything up in amplify ui:

- copy/paste `amplify.yml` into build settings (for some reason amplify won't use the repo version)
- set package overrides:
  - Amplify CLI: latest
  - Node.js version: 16
  - Next.js version: latest
- set environment variables:
  - `AMPLIFY_IDENTITYPOOL_ID <identity pool ID>` _eg: "eu-west-1:4e95e8d0-5411-4e1f-9242-a185ab5083ae"_
  - `AMPLIFY_USERPOOL_ID <cognito user pool ID>`
  - `AMPLIFY_NATIVECLIENT_ID <cognito native client ID>`
  - `AMPLIFY_WEBCLIENT_ID <cognito web client ID>`
  - `AMPLIFY_STORAGE_BUCKET_NAME <s3 bucket name>`
  - `AMPLIFY_STORAGE_REGION <s3 region>`
  - `AMPLIFY_NEXTJS_EXPERIMENTAL_TRACE true`
  - `NEXT_TELEMETRY_DISABLED 1`

update urls for login:

```bash
amplify auth update

# select "Add/Edit signin and signout redirect URIs"
```

```bash
amplify push
```

set up domain stuff on the amplify ui.

## Update a branch

We have a script in `bin/update-env.sh` that will handle environment switching so that a branch can be updated while maintaining its amplify environment.

```bash
git switch $target_branch
npm run merge -- $incoming_branch
```

If amplify changes are required also, these need to be made manually.

## Update an existing env

```bash
git switch $branch

amplify checkout --envName $env

amplify pull --envName $env

# make env changes..

amplify push --envName $env

git add amplify

git commit -m "amplify changes"

git push
```
