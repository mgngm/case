#!/bin/bash

echo $AWS_JOB_ID

if [ -z "$AWS_JOB_ID" ]; then
  echo "Generating graphql map..."
  npm run generate-graphql-map
  echo "Graphql map generation complete..."
  exit 0
else
  echo "Hooks disabled on CI"
  exit 0
fi
