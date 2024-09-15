import AuthForm from "@/components/AuthForm";
import React from "react";

const SignUp = () => {
  return (
    <section className="flex justify-center items-center w-screen h-screen">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUp;
