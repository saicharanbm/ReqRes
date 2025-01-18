import { Router } from "express";
import { oauth2Client } from "../utils/googleClient";
import axios from "axios";
import { prisma } from "../utils/db";
import { TokenType } from "../types";
import { generateToken } from "../utils";
export const router = Router();

router.post("/google", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).send("Missing code");
    return;
  }
  try {
    const googleResponse = await oauth2Client.getToken(code);

    if (!googleResponse) {
      res.status(400).send("Invalid code");
      return;
    }
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleResponse.tokens.access_token}`,
        },
      }
    );
    const { name, email, picture: avatar } = response.data;
    console.log(name, email, avatar);
    if (!name || !email || !avatar) {
      res.status(400).send("Invalid user data");
      return;
    }
    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    // If user doesn't exist, create it
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          avatar: avatar,
        },
      });
      console.log("user created:", user);
    }

    // Create access and refresh tokens
    if (!process.env.JWT_SECRET) {
      res
        .status(500)
        .json({ message: "Internal Server Error: Missing JWT_SECRET" });
      return;
    }

    const accessToken = generateToken(
      user.id,
      TokenType.ACCESS,
      process.env.JWT_SECRET
    );
    const refreshToken = generateToken(
      user.id,
      TokenType.REFRESH,
      process.env.JWT_SECRET
    );
    console.log(accessToken, refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.json({
      token: accessToken,
      message: "User successfully signed in",
      user: { name, email, avatar },
    });
  } catch (error) {
    console.log("google login error:", error);
    res.status(400).json({ message: "Something went wrong" });
  }
});

// const axios = require("axios");

router.post("/send-api-request", async (req, res) => {
  try {
    console.log(req.body);
    const { url, queryParams, headerList, body, requestType, bodyType } =
      req.body.data;

    // Construct query parameters
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    console.log("query string :", queryString);
    console.log("full Url :", fullUrl);

    // Convert header list to an object if needed
    interface Header {
      key: string;
      value: string;
    }

    const headers = headerList.reduce(
      (acc: Record<string, string>, { key, value }: Header) => {
        acc[key] = value;
        return acc;
      },
      {}
    );

    console.log("headers :", headers);

    // Configure request options
    const options = {
      method: requestType, // e.g., GET, POST, etc.
      url: fullUrl,
      headers,
      ...(requestType !== "GET" && {
        data: bodyType === "json" ? JSON.parse(body) : body,
      }), // Include body for non-GET requests
    };

    console.log("options :", options);
    // Make the API request
    // const response = await axios(options);

    // // Send back the API response to the user
    // res.json({
    //   message: "API request successful.",
    //   data: response.data,
    //   status: response.status,
    // });
  } catch (error) {
    // console.error("Error making API request:", error.message);
    // // Send back an error response
    // res.status(error.response?.status || 500).json({
    //   message: "API request failed.",
    //   error: error.response?.data || error.message,
    // });
  }
});
