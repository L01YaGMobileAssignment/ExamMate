import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { SignInDataType } from "../types/auth";
import { getToken, saveToken } from "../store/secureStore";
import * as Sentry from "@sentry/react-native";

export const SignInService = async (data: SignInDataType) => {
  try {
    const data_ = new URLSearchParams({
      grant_type: "password",
      username: data.username,
      password: data.password,
      scope: "",
      client_id: "string",
      client_secret: "********",
    });
    const res = await axios.post(apiEndpoints.signin, data_, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (res.status === 200) {
      const token = res.data.access_token;
      await saveToken(token);
      return res;
    }
    return res;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: "SignInService" },
      extra: { username: data.username }, // Don't include password for security
    });
    throw error;
  }
};

export const SignUpService = async (data: SignInDataType) => {
  try {
    const res = await axios.post(apiEndpoints.register, data);
    return res;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: "SignUpService" },
      extra: { username: data.username }, // Don't include password for security
    });
    throw error;
  }
};
