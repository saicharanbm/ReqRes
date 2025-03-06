import { Router } from "express";

export const router = Router();

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
