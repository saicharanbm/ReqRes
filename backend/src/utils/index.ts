import jwt from "jsonwebtoken";
import { TokenType } from "../types";

export const generateToken = (
  userId: string,
  type: TokenType,
  secret: string
) => {
  const expiresIn = type === "access" ? "10m" : "7d";

  return jwt.sign({ userId, type }, secret, {
    expiresIn,
  });
};

export function isHTML(content: string) {
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
}
