#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ToDoAppStack } from "../lib/todo-app-stack";

const app = new cdk.App();
new ToDoAppStack(app, "ToDoAppStack", {
  env: { region: "ap-northeast-1" },
});
