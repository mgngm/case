# Merging into an environment

Our product pipeline is managed by branches pointing at different environments. Develop, Staging and Production.
We also have a "stable" demo environment on the research platform which is due to be turned off shortly.

Because amplify configurations are tied to an environment branch, we need to be very careful when merging one branch into another such that we don't overwrite an environment's amplify configuration.

We can avoid this by using the `amplify` CLI to overwrite pulled changes to the amplify directory. Obviously this will mean that any intentional environment changes will need to be manually added post-merge, so be careful and watch what is being merged before moving on.

## Steps

Example shown merging `develop` branch into `staging`

1. Switch to the target branch

```
git switch staging
```

2. Ensure we have the up-to-date environment for the target branch

```
amplify pull --envName staging -y
```

3. Merge the code

```
git merge origin/develop
```

4. Resolve any conflicts etc. If there are conflicts in the amplify directory, resolve with the current `HEAD` but make a note as you may need to manually apply the changes later.

5. Commit the merge (if necessary)

```
git commit
```

6. Restore the environment configuration

```
amplify pull --envName staging -y
```

> :warning: If you need to update amplify, now is the time to do it.
>
> Make the necessary changes to the resource(s) and run an `amplify push --envName staging`. Also make sure you commit the changes you've made before doing the next step.

7. Update is complete, so you can safely push to the target branch

```
git push origin staging
```

### Clean up

There are usually a few auto-generated files that amplify creates during the pull which may appear in a `git diff`. This is usually because we've overwritten them in git with prettier. Typically they are:

- `src/models/index.js`
- `src/models/index.d.ts`
- `src/models/schema.js`
- `src/models/schema.d.ts`
- `amplify/backend/types/amplify-dependent-resources-ref.d.ts`

If you try and commit these to allow prettier to run in the pre-commit hook it will fail because once prettier has run there is nothing to commit. To get around this, you can run the following commands:

```
npm run prettier src/models/{index,schema}.{js,d.ts}
npm run prettier amplify/backend/types/amplify-dependent-resources-ref.d.ts
```

If there are changes after that, commit them as an env update

```
git commit -am "[env] post amplify pull update"
```
