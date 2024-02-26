#!/bin/bash

cd ../frontend
npm run build
cd ../infrastructure

cd ../auth
npm install
cd ../infrastructure

CALLBACK_URL=$(aws cloudformation describe-stacks \
  --stack-name CognitoStack \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CallbackUrl'].OutputValue" \
  --output text)

if [ "$CALLBACK_URL" == "None" ]; then
  CALLBACK_URL=""
fi

npx cdk deploy CognitoStack -c callbackUrl=$CALLBACK_URL

USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name CognitoStack \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CognitoUserPoolId'].OutputValue" \
  --output text)
USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks \
  --stack-name CognitoStack \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CognitoUserPoolClientId'].OutputValue" \
  --output text)
USER_POOL_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name CognitoStack \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CognitoUserPoolDomainName'].OutputValue" \
  --output text)
cd ../auth
sed \
  -e "s/{{ UserPoolId }}/$USER_POOL_ID/g" \
  -e "s/{{ UserPoolClientId }}/$USER_POOL_CLIENT_ID/g" \
  -e "s/{{ UserPoolDomain }}/$USER_POOL_DOMAIN/g" \
  ./index.template.js > ./index.js
cd ../infrastructure

npx cdk deploy ToDoAppStack

CLOUD_FRONT_DOMAIN_NAME=$(aws cloudformation describe-stacks \
  --stack-name ToDoAppStack \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text)

npx cdk deploy CognitoStack -c callbackUrl=https://$CLOUD_FRONT_DOMAIN_NAME
