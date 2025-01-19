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
          const headers = headerList?.reduce(
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

          if (contentType?.includes("application/json")) {
            responseData = await response.json();
          } else if (contentType?.includes("text/")) {
            responseData = await response.text();
          } else {
            // For binary data, convert to base64
            const buffer = await response.arrayBuffer();
            responseData = btoa(
              new Uint8Array(buffer).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
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
          });
        } catch (error: any) {
          // Remove from active requests
          activeRequests.delete(requestId);

          sendResponse({
            success: false,
            error: error.message,
          });
        }

        return keepAlive;
      }
    } catch (error: any) {
      sendResponse({
        success: false,
        error: error.message,
      });
      return keepAlive;
    }
  }
);

// Clean up old requests periodically
// setInterval(() => {
//   const now = Date.now();
//   activeRequests.forEach((request, id) => {
//     if (now - request.timestamp > 30000) {
//       // 30 seconds timeout
//       activeRequests.delete(id);
//     }
//   });
// }, 10000);
