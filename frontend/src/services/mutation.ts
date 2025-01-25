import { RequestData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "./api";
import { toast } from "react-toastify";

export const useSendRequestMutation = () => {
  return useMutation({
    mutationFn: async ({
      data,
      hasExtension,
      runtime,
      isLocalhost,
    }: {
      data: RequestData;
      hasExtension: boolean;
      runtime: typeof chrome.runtime;
      isLocalhost: boolean;
    }) => {
      // try {
      if (hasExtension && runtime) {
        // Send request through extension
        const response = await new Promise((resolve, reject) => {
          runtime.sendMessage(
            "nbgnlealnfkpjabjpffdgodlojacdlaf",
            {
              type: "MAKE_REQUEST",
              data,
            },
            (response: any) => {
              if (response?.error) {
                reject(new Error(response.error));
              } else {
                resolve(response);
              }
            }
          );
        });

        console.log("Response from extension:", response);
        return response;
      }
      if (isLocalhost && (!hasExtension || !runtime)) {
        toast.error(
          "To test localhost APIs, please install our browser extension or use a tunneling service like ngrok and expose your localhost to the internet."
        );
        throw new Error(
          "To test localhost APIs, please install our browser extension or use a tunneling service like ngrok and expose your localhost to the internet."
        );
      }
      const response = await apiRequest(data);
      console.log("Response from API:", response);
      return response.data;
      // } catch (error) {
      //   const errorMessage = (error as Error).message || "Request failed";
      //   toast.error(`Request failed: ${errorMessage}`);
      //   return {
      //     success: false,
      //     message: errorMessage,
      //   };
      // }
    },
  });
};
