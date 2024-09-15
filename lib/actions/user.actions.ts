"use server";

import { ID } from "node-appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "../server/appwrite";

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(session);
  } catch (e) {
    console.error("Error", e);
  }
};

export const signUp = async (userData: SignUpParams) => {
  try {
    const { email, password, firstName, lastName } = userData;

    const { account } = await createAdminClient();

    const newUser = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (e) {
    console.error("Error", e);
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const appwriteAccount = await account.get();

    return parseStringify(appwriteAccount);
  } catch (error) {
    return null;
  }
};

export const logOutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (e) {
    console.error("Error", e);
  }
};
