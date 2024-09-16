"use server";

import { CountryCode, ItemPublicTokenExchangeRequest, LinkTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../server/plaid";
import { encryptId, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { addFundingSource } from "./dwolla.actions";
import { createBankAccount } from "./user.actions";

export const createPlaidToken = async () => {
  try {
  } catch (e) {
    console.error(e);
  }
};

export const createLinkToken = async (user: User) => {
  try {
    console.log("User from Backend", user);
    const tokenConfig: LinkTokenCreateRequest = {
      user: {
        client_user_id: user?.$id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenConfig);
    console.log("Plaid Link Token response : ");
    return parseStringify({
      linkedToken: response.data.link_token,
    });
  } catch (e) {
    console.error(e);
  }
};

export const exchangePublicToken = async ({ publicToken, user }: { publicToken: string; user: User }) => {
  try {
    // exchange public token
    const exchangeTokenParams: ItemPublicTokenExchangeRequest = {
      public_token: publicToken,
    };
    const response = await plaidClient.itemPublicTokenExchange(exchangeTokenParams);
    const { access_token, item_id } = response.data;

    // get accounts
    const accountResponse = await plaidClient.accountsGet({
      access_token,
    });
    const accounts = accountResponse.data.accounts[0];

    // connect to dwolla processor using access token and account id
    const dwollaResponse = await plaidClient.processorTokenCreate({
      access_token,
      account_id: accounts.account_id,
      processor: ProcessorTokenCreateRequestProcessorEnum.Dwolla,
    });
    const { processor_token } = dwollaResponse.data;

    // create funding source url for the account using Dwolla customer ID, processor token and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken: processor_token,
      bankName: accounts.name,
    });
    if (!fundingSourceUrl) throw Error;

    // create a bank account using the user id, item id, account id, access token, funding source url and sharable id
    await createBankAccount({
      userId: user.$id,
      bankId: item_id,
      accountId: accounts.account_id,
      accessToken: access_token,
      fundingSourceUrl,
      sharableId: encryptId(accounts.account_id),
    });

    // revalidate the path to reflect the changes
    revalidatePath("/");

    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (e) {
    console.error(e);
  }
};
