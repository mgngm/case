#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # 
# 
# Update the current branch and amplify env with another
# branch without overwriting the amplify env
#
# Usage: ./update-env.sh $incoming_branch
#
# example: ./update-env.sh staging
#
# # # # # # # # # # # # # # # # # # # # # # # # 

BRANCH=`git branch --show-current`
INCOMING_BRANCH=$1

if [ -z "$INCOMING_BRANCH" ]; then
  echo "Merge branch not specified"
  exit 1
fi

echo "Updating env $BRANCH with $INCOMING_BRANCH..."
read -p "Continue? [y/N] " CONTINUE

if [ "$CONTINUE" != "y" ]; then
  exit 0
fi

# start with git up to date
git remote update

REMOTE_NAME=`git remote -v show | grep web-ui/tesseract.git | grep fetch | awk '{print $1}'`
# ensure you're on the right branch
git fetch $REMOTE_NAME
git checkout $BRANCH
git pull $REMOTE_NAME/$BRANCH


HAS_ENV=`amplify env list --json | jq --arg branch $BRANCH '.envs | map(select(. == $branch)) | length'`

if [[ $HAS_ENV == 0 ]]; then
  echo "amplify environment for $BRANCH missing"
  amplify env list
  exit 1
fi

# do a pull early so we can validate credentials and make
# sure we're up to date before messing around
amplify pull --env $BRANCH -y


# switch to incoming branch env
amplify env checkout $INCOMING_BRANCH
amplify pull --env $INCOMING_BRANCH -y

# merge
git merge $INCOMING_BRANCH --no-edit

# conflicts?
HAS_CONFLICTS=`git diff --name-only --diff-filter=U --relative` # better way?

if [ ! -z "$HAS_CONFLICTS" ]; then
  echo "CONFLICTS!"
  echo ""
  echo "fix the conflicts, then restore the amplify environment with:"
  echo "amplify env checkout $BRANCH"
  echo "amplify pull --env $BRANCH -y"
  echo "then commit and push the merge result"
  echo "git commit -am 'some message...' && git push"
  exit 1
fi

# restore env
amplify env checkout $BRANCH
amplify pull --env $BRANCH -y

# tidy up the generated files
npx prettier --config .prettierrc.json --write amplify/backend/types/amplify-dependent-resources-ref.d.ts
npx prettier --config .prettierrc.json --write src/models/index.*
npx prettier --config .prettierrc.json --write src/models/schema.*

# tidy up
git commit -am "[env update] post env update: $INCOMING_BRANCH to $BRANCH" --allow-empty

# push to the pipeline
git push
