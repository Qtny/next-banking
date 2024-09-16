"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-in") {
        const user = await signIn({
          email: values.email,
          password: values.password,
        });
        if (user) {
          router.push("/");
        } else {
          console.log("user does not have an account");
        }
      }

      if (type === "sign-up") {
        const userData = {
          firstName: values.firstName!,
          lastName: values.lastName!,
          address1: values.address1!,
          city: values.city!,
          state: values.state!,
          postalCode: values.postalCode!,
          dateOfBirth: values.dateOfBirth!,
          ssn: values.ssn!,
          email: values.email,
          password: values.password,
        };

        const newUser = await signUp(userData);
        if (newUser) {
          setUser(newUser);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-10 items-start flex-col">
      <Link
        href="/"
        className="flex items-cent
        er cursor-pointer gap-2"
      >
        <Image src="/icons/logo.svg" alt="Horizon Logo" width={34} height={34} />
        <p className="font-bold font-ibm-plex-serif text-[30px] leading-[34px] 2xl:text-26 text-black-1">Horizon</p>
      </Link>

      <div className="flex flex-col gap-6">
        <h1 className="text-gray-900 font-semibold text-4xl">{user ? "Link Account" : type === "sign-in" ? "Log in" : "Sign up"}</h1>
        <p className="text-base text-gray-600 font-normal">{type === "sign-in" ? "Welcome back! Please enter your details" : "Please enter your details"}</p>
      </div>

      {user ? (
        <PlaidLink user={user} variant={"primary"} />
      ) : (
        <div className="w-full gap-10 flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-6">
              {type === "sign-up" && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between gap-4">
                    <CustomInput control={form.control} label="First Name" name="firstName" placeholder="Enter your first name" />
                    <CustomInput control={form.control} label="Last Name" name="lastName" placeholder="Enter your last name" />
                  </div>
                  <CustomInput control={form.control} label="Address" name="address1" placeholder="Enter your specific address" />
                  <CustomInput control={form.control} label="City" name="city" placeholder="Example: Subang Jaya" />
                  <div className="flex justify-between gap-4">
                    <CustomInput control={form.control} label="State" name="state" placeholder="Example: SE" />
                    <CustomInput control={form.control} label="Postal Code" name="postalCode" placeholder="Example: 12300" />
                  </div>
                  <div className="flex justify-between gap-4">
                    <CustomInput control={form.control} label="Date of Birth" name="dateOfBirth" placeholder="Example: YYYY/MM/DD" />
                    <CustomInput control={form.control} label="SSN" name="ssn" placeholder="Example: 12345" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <CustomInput control={form.control} label="Email" name="email" placeholder="Enter your email address" />

                <CustomInput control={form.control} label="Password" name="password" placeholder="Enter your password" />
              </div>

              <Button type="submit" className="bg-bank-gradient hover:opacity-80 text-white w-full" disabled={isLoading}>
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : type === "sign-in" ? "Login" : "Sign Up"}
              </Button>
            </form>
          </Form>
          <p className="gap-1 flex text-sm text-gray-600 font-normal w-full items-center justify-center">
            {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
            <span className="text-bankGradient font-semibold">{type === "sign-in" ? <Link href="/sign-up">Sign Up</Link> : <Link href="/sign-in">Sign In</Link>}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
