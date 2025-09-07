import { Header, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const adminPassword = secret("AdminPassword");

interface AuthParams {
  authorization?: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
  role: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const token = data.authorization?.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    // Simple password-based authentication for admin panel
    if (token !== adminPassword()) {
      throw APIError.unauthenticated("invalid token");
    }

    return {
      userID: "admin",
      role: "admin",
    };
  }
);

export const gw = new Gateway({ authHandler: auth });
