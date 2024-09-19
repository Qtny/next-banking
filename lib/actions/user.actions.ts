"use server";

import { ID, Query } from "node-appwrite";
import { extractCustomerIdFromUrl, parseStringify } from "../utils";
import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "../server/appwrite";
import { createCustomer } from "./dwolla.actions";

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

    const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (e) {
    console.error("Error", e);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { APPWRITE_DATABASE_ID, APPWRITE_USER_COLLECTION_ID } = process.env;
  const { email, firstName, lastName } = userData;

  let newUser;

  try {
    const { database, account } = await createAdminClient();

    // create user for auth
    newUser = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);

    if (!newUser) throw Error("Error creating user");

    // create dwolla customer
    const dwollaCustomer = await createCustomer({
      ...userData,
      type: "personal",
    });
    if (!dwollaCustomer) throw Error("Error creating Dwolla customer");
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomer);

    // create user for database
    const dbUser = await database.createDocument(APPWRITE_DATABASE_ID!, APPWRITE_USER_COLLECTION_ID!, ID.unique(), {
      ...userData,
      userId: newUser.$id,
      dwollaCustomerId,
      dwollaCustomerUrl: dwollaCustomer,
    });

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(dbUser);
  } catch (e) {
    console.error("Error", e);
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const appwriteAccount = await account.get();

    // get user from database
    const user = await getUserInfo({ userId: appwriteAccount.$id });

    return parseStringify(user);
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

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { APPWRITE_DATABASE_ID, APPWRITE_USER_COLLECTION_ID } = process.env;

    const { database } = await createAdminClient();
    const user = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_USER_COLLECTION_ID!, [Query.equal("userId", userId)]);

    return parseStringify(user.documents[0]);
  } catch (e) {
    console.error(e);
  }
};
export const createBankAccount = async ({ userId, bankId, accountId, accessToken, fundingSourceUrl, sharableId }: createBankAccountProps) => {
  try {
    const { APPWRITE_DATABASE_ID, APPWRITE_BANK_COLLECTION_ID } = process.env;

    const { database } = await createAdminClient();
    return await database.createDocument(APPWRITE_DATABASE_ID!, APPWRITE_BANK_COLLECTION_ID!, ID.unique(), {
      userId,
      bankId,
      accountId,
      accessToken,
      fundingSourceUrl,
      sharableId,
    });
  } catch (e) {
    console.error(e);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { APPWRITE_DATABASE_ID, APPWRITE_BANK_COLLECTION_ID } = process.env;

    const { database } = await createAdminClient();
    const banks = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_BANK_COLLECTION_ID!, [Query.equal("userId", userId)]);

    return parseStringify(banks.documents);
  } catch (e) {
    console.error(e);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { APPWRITE_DATABASE_ID, APPWRITE_BANK_COLLECTION_ID } = process.env;

    const { database } = await createAdminClient();
    const bank = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_BANK_COLLECTION_ID!, [Query.equal("$id", documentId)]);

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (e) {
    console.error(e);
  }
};
