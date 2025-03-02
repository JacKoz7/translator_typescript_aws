"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { LoginForm } from "@/components";

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
    <LoginForm
      onSignedIn={async () => {
        const currUser = await getCurrentUser();
        console.log(currUser);
        setUser(currUser);
      }}
    />
  );
}
