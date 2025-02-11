"use client";
import { useState } from "react";
import { signIn, signOut } from "aws-amplify/auth";
import Link from "next/link";

export default function User() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <form className="flex flex-col space-y-4" onSubmit={async (event) => {}}>
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

      <button className="btn bg-blue-500" type="submit">
        Login
      </button>

      <Link className="hover:underline" href="/register">
        Register
      </Link>
    </form>
  );
}
