#!/bin/bash

cd ../frontend
npm run build
cd ../infrastructure

cd ../auth
npm install
cd ../infrastructure

COGNITO_CALLBACK_URL_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name CognitoStack \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CognitoCallbackUrlDomain'].OutputValue" \
  --output text)

if [ "$COGNITO_CALLBACK_URL_DOMAIN" == "None" ]; then
  COGNITO_CALLBACK_URL_DOMAIN=""
fi

# 初期構築時には CALLBACK_URL が空白で渡され、2回目以降は前回デプロイ時に構築された CloudFrontDistribution のドメイン名が渡される
# 2回目以降は前回デプロイ時の最後の Cognito のデプロイと同じ構成となるため、初期構築時にのみ実行される想定
npx cdk deploy CognitoStack -c CognitoCallbackUrlDomain=$COGNITO_CALLBACK_URL_DOMAIN --require-approval never

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

npx cdk deploy ToDoAppStack --require-approval never

DISTRIBUTION_DOMAIN_NAME=$(aws cloudformation describe-stacks \
  --stack-name ToDoAppStack \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionDomainName'].OutputValue" \
  --output text)

npx cdk deploy CognitoStack -c CognitoCallbackUrlDomain=$DISTRIBUTION_DOMAIN_NAME --require-approval never
