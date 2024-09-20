"use server";

import { Client } from "dwolla-v2";

const { DWOLLA_KEY, DWOLLA_SECRET, DWOLLA_ENV } = process.env;

const getEnvironment = (): "production" | "sandbox" => {
  const environment = DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error("Dwolla environment should either be set to `sandbox` or `production`");
  }
};

const dwollaClient = new Client({
  key: DWOLLA_KEY!,
  secret: DWOLLA_SECRET!,
  environment: getEnvironment(),
});

export const addFundingSource = async ({ dwollaCustomerId, processorToken, bankName }: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};

const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post("on-demand-authorizations");
    console.log("Received On Demand Authorization => ", onDemandAuthorization.body._links);
    return onDemandAuthorization.body._links;
    // {
    //     "_links": {
    //       "self": {
    //         "href": "https://api-sandbox.dwolla.com/on-demand-authorizations/30e7c028-0bdf-e511-80de-0aa34a9b2388"
    //       }
    //     },
    //     "bodyText": "I agree that future payments to Company ABC inc. will be processed by the Dwolla payment system from the selected account above. In order to cancel this authorization, I will change my payment settings within my Company ABC inc. account.",
    //     "buttonText": "Agree & Continue"
    // }
  } catch (e) {
    console.error("Create an On Demand Authorization failed : ");
    console.error(e);
  }
};

export const createFundingSource = async ({ customerId, fundingSourceName, plaidToken, _links }: CreateFundingSourceOptions) => {
  try {
    const url = `customers/${customerId}/funding-sources`;
    const body = {
      name: fundingSourceName,
      plaidToken,
    };
    const response = await dwollaClient.post(url, body);
    console.log("Received Create Funding Source => ", response.headers.get("location"));
    return response.headers.get("location");
  } catch (e) {
    console.error("Create a Dwolla Funding Source failed : ");
    console.error(e);
  }
};

export const createCustomer = async (customerParams: NewDwollaCustomerParams) => {
  try {
    const url = `customers`;
    const response = await dwollaClient.post(url, customerParams);
    return response.headers.get("location");
  } catch (e: any) {
    console.error("Create a Dwolla Customer failed : ");
    console.error("Error Message : ", e.body.message);
    console.error("Errors: ", e.body._embedded.errors);
  }
};

export const createTransfer = async ({ amount, destinationFundingSourceUrl, sourceFundingSourceUrl }: TransferParams) => {
  console.log("==============================");
  console.log(amount);
  console.log(destinationFundingSourceUrl);
  console.log(sourceFundingSourceUrl);
  console.log("==============================");
  try {
    const url = `transfers`;
    const body = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    const response = await dwollaClient.post(url, body);

    return response.headers.get("location");
  } catch (e: any) {
    console.error("Create a Dwolla Transfer failed : ");
    console.error("Error Message : ", e.body.message);
    console.error("Errors: ", e.body._embedded.errors);
  }
};
