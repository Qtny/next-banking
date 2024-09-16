import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)

const { PLAID_CLIENT_ID, PLAID_SECRET } = process.env;

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
