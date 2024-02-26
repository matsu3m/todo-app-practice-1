import { App } from "aws-cdk-lib";
import "source-map-support/register";
import { CognitoStack } from "../lib/stacks/cognito-stack";
import { ToDoAppStack } from "../lib/stacks/todo-app-stack";

const app = new App();

new CognitoStack(app, "CognitoStack", {
  env: { region: "us-east-1" },
  callbackUrlDomain: app.node.tryGetContext("CognitoCallbackUrlDomain"),
});

new ToDoAppStack(app, "ToDoAppStack", {
  env: { region: "us-east-1" },
});
