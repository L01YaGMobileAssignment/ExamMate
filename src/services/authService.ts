import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { SignInDataType } from "../types/auth";
import { getToken, saveToken } from "../store/secureStore";

export const SignInService = async (data: SignInDataType) => {
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
};

export const SignUpService = async (data: SignInDataType) => {
  const res = await axios.post(apiEndpoints.register, data);
  return res;
};