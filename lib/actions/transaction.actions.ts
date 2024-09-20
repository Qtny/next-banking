"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../server/appwrite";
import { parseStringify } from "../utils";

const { APPWRITE_DATABASE_ID, APPWRITE_TRANSACTION_COLLECTION_ID } = process.env;

export const createTransaction = async (data: CreateTransactionProps) => {
  try {
    const { database } = await createAdminClient();
    const transaction = await database.createDocument(APPWRITE_DATABASE_ID!, APPWRITE_TRANSACTION_COLLECTION_ID!, ID.unique(), {
      channel: "online",
      category: "Transfer",
      ...data,
    });

    return parseStringify(transaction);
  } catch (e) {
    console.error(e);
  }
};

export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
  try {
    const { database } = await createAdminClient();
    const transactions = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_TRANSACTION_COLLECTION_ID!, [Query.equal("senderBankId", bankId)]);

    return parseStringify(transactions);
  } catch (e) {
    console.error(e);
  }
};
