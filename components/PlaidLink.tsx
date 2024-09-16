import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess } from "react-plaid-link";
import { useRouter } from "next/navigation";
import { createLinkToken, exchangePublicToken } from "@/lib/actions/plaid.actions";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkedToken);
    };

    getLinkToken();
  }, [user]);

  // create link token
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      console.log("User Object => ", user);
      console.log("Dwolla Customer Id => ", user.dwollaCustomerId);
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });
      router.push("/");
    },
    [router, user]
  );

  const config: PlaidLinkOptions = {
    onSuccess,
    token,
  };

  const { open, ready } = usePlaidLink(config);
  return (
    <>
      {variant === "primary" ? (
        <Button className="w-full bg-bank-gradient text-base text-white shadow-form border border-bank-gradient rounded-lg font-semibold" onClick={() => open()} disabled={!ready}>
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button>Connect Bank</Button>
      ) : (
        <Button>Connect Bank</Button>
      )}
    </>
  );
};

export default PlaidLink;
