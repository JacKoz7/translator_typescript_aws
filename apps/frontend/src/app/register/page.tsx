"use client";
import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          if (password != password2) {
            throw new Error("Password don't match");
          }
          const { nextStep } = await signUp({
            username: email,
            password: password,
            options: {
              userAttributes: {
                email,
              },
              autoSignIn: true,
            },
          });

          console.log(nextStep.signUpStep);
        } catch (e) {}
      }}
    >
      <div>
        <label htmlFor="email">E-mail:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password2">Confirm password:</label>
        <input
          id="password2"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </div>

      <button className="btn bg-blue-500" type="submit">
        Register
      </button>

      <Link className="hover:underline" href="/user">
        Login
      </Link>
    </form>
  );
}
