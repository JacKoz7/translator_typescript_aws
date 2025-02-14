"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import Link from "next/link";

function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
        await signIn({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
            },
          },
        });
        onSignedIn();
      }catch(e){
        setError(e.toString())
      }
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

      <button className="btn bg-blue-500" type="submit">
        Login
      </button>

      <Link className="hover:underline" href="/register">
        Register
      </Link>
      {error && <p className="text-red-600 font-bold">{error}</p>}
    </form>
  );
}

function Logout({ onSignedOut }: { onSignedOut: () => void }) {
  return (
    <div className="w-full flex">
      <button
        className="btn bg-blue-500 w-full"
        onClick={async () => {
          await signOut();
          onSignedOut();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default function User() {
  // object or null - we know that user exist or not
  // undefined is the state before we know that
  const [user, setUser] = useState<object | null | undefined>(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const currUser = await getCurrentUser();
        console.log(currUser);
        setUser(currUser);
      } catch (e) {
        console.log(e);
        setUser(null);
      }
    }
    fetchUser();
  }, []);
  if (user === undefined) {
    return <p>loading...</p>;
  }
  if (user) {
    return <Logout onSignedOut={() => setUser(null)} />;
  }
  return (
    <Login
      onSignedIn={async () => {
        const currUser = await getCurrentUser();
        console.log(currUser);
        setUser(currUser);
      }}
    />
  );
}
