// running on client side
"use client";
import { Amplify } from "aws-amplify";
Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: "us-east-1_VBEzFJHdQ",
        userPoolClientId: "7hig83rangn3pn8q8u63v2cufo",
      },
    },
  },
  {
    ssr: true,
  }
);

export function ConfigureAmplify() {
  return null;
}
