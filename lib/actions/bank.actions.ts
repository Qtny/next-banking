"use server";

import { CountryCode } from "plaid";
import { plaidClient } from "../server/plaid";
import { getBank, getBanks } from "./user.actions";
import { parseStringify } from "../utils";
import { getTransactionsByBankId } from "./transaction.actions";

export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // retrieve banks from database
    const banks = await getBanks({ userId });

    // retrieve accounts from banks
    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        const accountResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });

        const { institution_id } = accountResponse.data.item;

        const account = accountResponse.data.accounts[0];
        return {
          id: account.account_id,
          availableBalance: account.balances.available,
          currentBalance: account.balances.current,
          institutionId: institution_id,
          name: account.name,
          officialName: account.official_name,
          mask: account.mask,
          type: account.type,
          subtype: account.subtype,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId,
        };
      })
    );

    const totalBanks = banks.length;
    const totalCurrentBalance = accounts.reduce((prev, curr) => {
      return prev + curr.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (e) {
    console.error("An error occurred while getting the accounts:", e);
  }
};

export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    // 1. get bank from database
    const bank = await getBank({ documentId: appwriteItemId });

    // 2. get account from plaid
    const accountResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountResponse.data.accounts[0];

    // 3, get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({ bankId: bank.$id });
    const transfers = transferTransactionsData.documents.map ((transferData: any) => {
      return {
        id: transferData.$id,
        name: transferData.name!,
        amount: `-${transferData.amount!}`,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      };
    });

    // 4. get institution info from plaid
    const { institution_id } = accountResponse.data.item;
    const institution = await getInstitution({ institutionId: institution_id! });

    // 5. get transaction from plaid
    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    // 6. form account object
    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // 7. sort transactions (transaction from plaid and transfer transaction from database) by date such that the most recent transaction is first
    const allTransactions = [...transactions, ...transfers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (e) {
    console.error("An error occurred while getting the account:", e);
  }
};

export const getInstitution = async ({ institutionId }: getInstitutionProps) => {
  try {
    const instituteResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId!,
      country_codes: [CountryCode.Us],
    });

    const institute = instituteResponse.data.institution;
    return parseStringify(institute);
  } catch (e) {
    console.error("An error occurred while getting the institute:", e);
  }
};

export const getTransactions = async ({ accessToken }: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any[] = [];

  try {
    while (hasMore) {
      const transactionResponse = await plaidClient.transactionsSync({
        access_token: accessToken,
      });
      const data = transactionResponse.data;

      transactions = data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (e) {
    console.error("An error occurred while getting transactions", e);
  }
};

export const createTransfer = async () => {
  try {
  } catch (e) {
    console.error("An error occurred while creating transfer", e);
  }
};
