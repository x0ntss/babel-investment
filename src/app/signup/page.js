"use client";
import { Suspense } from "react";
import SignUpPage from "../components/SignUpPage";

function SignUpPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpPage />
    </Suspense>
  );
}

export default function SignUpPageRoute() {
  return <SignUpPageWrapper />;
} 