#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { CognitoStack } from "../lib/cognito-stack";
import { ToDoAppStack } from "../lib/todo-app-stack";

const app = new cdk.App();

new CognitoStack(app, "CognitoStack", {
  env: { region: "us-east-1" },
  callbackUrl: app.node.tryGetContext("callbackUrl"),
});

new ToDoAppStack(app, "ToDoAppStack", {
  env: { region: "us-east-1" },
});
