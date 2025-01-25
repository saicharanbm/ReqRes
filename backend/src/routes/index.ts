import { Router } from "express";
import { oauth2Client } from "../utils/googleClient";
import axios from "axios";
import { prisma } from "../utils/db";
import { TokenType } from "../types";
import { generateToken, isHTML } from "../utils";
export const router = Router();

router.post("/google", async (req, res) => {
  console.log("hello");
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
    const queryString = queryParams
      .filter(
        (param: { key: string; value: string }) => param.key && param.value
      )
      .map(
        (param: { key: string; value: string }) =>
          `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`
      )
      .join("&");
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    // Convert header list to an object
    const headers = headerList
      .filter(
        (header: { key: string; value: string }) => header.key && header.value
      )
      .reduce(
        (
          acc: Record<string, string>,
          { key, value }: { key: string; value: string }
        ) => {
          acc[key] = value;
          return acc;
        },
        {}
      );

    // Make the request
    const options: RequestInit = {
      method: requestType,
      headers: {
        ...headers,
        Accept: "*/*",
        "Content-Type": bodyType === "json" ? "application/json" : "text/plain",
      },
    };

    // Add the body conditionally
    if (requestType !== "GET" && body) {
      options.body =
        bodyType === "json" ? JSON.stringify(JSON.parse(body)) : body;
    }

    // console.log("options", options);

    const response = await fetch(fullUrl, options);
    // Get response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Handle different response types
    let responseData;
    const contentType = response.headers.get("content-type");

    // Get content length from response headers
    let contentLength = response.headers.get("content-length");
    let responseSize = contentLength ? parseInt(contentLength, 10) : 0;

    // Handle different response types
    if (contentType?.includes("application/json")) {
      responseData = await response.json();
      if (!contentLength) {
        responseSize = new TextEncoder().encode(
          JSON.stringify(responseData)
        ).length;
      }
    } else if (contentType?.includes("text/")) {
      responseData = await response.text();

      if (!contentLength) {
        responseSize = new TextEncoder().encode(responseData).length;
      }
    } else {
      const buffer = await response.arrayBuffer();
      responseData = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      responseSize = buffer.byteLength;
    }
    console.log("responseData", responseData);
    console.log("responseSize", responseSize);
    console.log("responseHeaders", responseHeaders);

    // Send back the API response to the user
    res.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseData,
      contentType,
      size: responseSize, // Include the calculated response size
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Could not send request through proxy server.",
    });
  }
});

router.get("/hello", (req, res) => {
  console.log("hello");
  res.status(400).send("Hello this is the error");
});
