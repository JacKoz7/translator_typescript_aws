import {
  ITranslateRequest,
  ITranslatePrimaryKey,
  ITranslateResultList,
  ITranslateResult,
} from "@sff/shared-types";
import { fetchAuthSession } from "aws-amplify/auth";

const URL = "https://api.jacekkozlowski.com";

export const translatePublicText = async (request: ITranslateRequest) => {
  try {
    const result = await fetch(`${URL}/public`, {
      method: "POST",
      body: JSON.stringify(request),
    });

    const rtnValue = (await result.json()) as ITranslateResult | string;
    if (!result.ok) {
      throw new Error(rtnValue as string);
    }
    return rtnValue as ITranslateResult;
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }
};

export const translateUsersText = async (request: ITranslateRequest) => {
  try {
    // users not logged in cant make translations
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

    const result = await fetch(`${URL}/user`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const rtnValue = (await result.json()) as ITranslateResult | string;
    if (!result.ok) {
      throw new Error(rtnValue as string);
    }
    return rtnValue as ITranslateResult;
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }
};

export const getUsersTranslations = async () => {
  try {
    // users not logged in cant see translations
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    console.log("authToken:", authToken);

    const result = await fetch(`${URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const rtnValue = (await result.json()) as ITranslateResultList;
    return rtnValue;
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }
};

export const deleteUserTranslation = async (item: ITranslatePrimaryKey) => {
  try {
    // users not logged in cant see translations
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

    const result = await fetch(`${URL}/user`, {
      method: "DELETE",
      body: JSON.stringify(item),
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const rtnValue = (await result.json()) as ITranslatePrimaryKey;
    return rtnValue;
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }
};
