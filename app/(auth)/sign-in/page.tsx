"use client";

import AuthForm from "@/components/AuthForm";
import React from "react";

const SignIn = () => {
   return (
    <section className="flex justify-center items-center w-screen h-screen">
      <AuthForm type="sign-in"/>
    </section>
  );
};

export default SignIn;
