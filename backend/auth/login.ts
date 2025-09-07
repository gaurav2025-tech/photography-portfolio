import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const adminPassword = secret("AdminPassword");

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

// Admin login endpoint.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    if (req.password !== adminPassword()) {
      throw new Error("Invalid password");
    }

    return {
      token: req.password,
      message: "Login successful",
    };
  }
);
