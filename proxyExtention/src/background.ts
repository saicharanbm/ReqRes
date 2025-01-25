let activeRequests = new Map();

chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    // Enable response to be sent after async operations
    const keepAlive = true;

    try {
      if (request.type === "CHECK_INSTALLED") {
        sendResponse({ status: "success", installed: true });
        return keepAlive;
      }

      if (request.type === "MAKE_REQUEST") {
        const { url, queryParams, headerList, body, requestType, bodyType } =
          request.data;

        // Generate unique request ID
        const requestId = Date.now().toString();

        // Store request details
        activeRequests.set(requestId, {
          timestamp: Date.now(),
          details: request.data,
        });

        try {
          // Construct query string
          const queryString = queryParams
            ?.filter(
              (param: { key: string; value: string }) =>
                param.key && param.value
            )
            .map(
              (param: { key: string; value: string }) =>
                `${encodeURIComponent(param.key)}=${encodeURIComponent(
                  param.value
                )}`
            )
            .join("&");

          const fullUrl = queryString ? `${url}?${queryString}` : url;

          // Construct headers
          const headers = headerList
            .filter(
              (header: { key: string; value: string }) =>
                header.key && header.value
            )
            .reduce(
              (
                acc: Record<string, string>,
                { key, value }: { key: string; value: string }
              ) => {
                if (key && value) {
                  acc[key] = value;
                }
                return acc;
              },
              {}
            );

          // Make the request
          const response = await fetch(fullUrl, {
            method: requestType,
            headers: {
              ...headers,
              Accept: "*/*",
            },
            ...(requestType !== "GET" &&
              body && {
                body:
                  bodyType === "json" ? JSON.stringify(JSON.parse(body)) : body,
              }),
          });

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

          // Remove from active requests
          activeRequests.delete(requestId);

          sendResponse({
            success: true,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            data: responseData,
            contentType,
            size: responseSize,
          });
        } catch (error: any) {
          // Remove from active requests
          activeRequests.delete(requestId);

          sendResponse({
            success: false,
            error: "Could not send request through extension.",
          });
        }

        return keepAlive;
      }
    } catch (error: any) {
      sendResponse({
        success: false,
        error: "Failed to send request through extension.",
      });
      return keepAlive;
    }
  }
);

// // Clean up old requests periodically
setInterval(() => {
  const now = Date.now();
  activeRequests.forEach((request, id) => {
    if (now - request.timestamp > 30000) {
      // 30 seconds timeout
      activeRequests.delete(id);
    }
  });
}, 10000);
