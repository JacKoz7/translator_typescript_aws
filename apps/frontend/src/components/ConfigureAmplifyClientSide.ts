// running on client side
"use client";
import { Amplify } from "aws-amplify";
Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: "us-east-1_RWUy2hVT7",
        userPoolClientId: "79unrfvdm9dm28fomomhbg6e2t",
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
