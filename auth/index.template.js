import { Authenticator } from "cognito-at-edge";

const authenticator = new Authenticator({
  region: "us-east-1",
  userPoolId: "{{ UserPoolId }}",
  userPoolAppId: "{{ UserPoolClientId }}",
  userPoolDomain: "{{ UserPoolDomain }}" + ".auth.us-east-1.amazoncognito.com",
  cookiePath: "/",
});

export const handler = async (event) => {
  return authenticator.handle(event);
};
