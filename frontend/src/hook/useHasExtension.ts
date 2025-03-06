import { useEffect, useState } from "react";

interface ExtensionResponse {
  status: "success";
  installed: boolean;
}

function useHasExtension(): boolean {
  const [hasExtension, setHasExtension] = useState<boolean>(false);

  useEffect(() => {
    console.log(window);
    // Ensure we're in a browser environment
    if (typeof window === "undefined" || !window.chrome) {
      console.warn("Chrome runtime not available");
      return;
    }

    const checkExtension = () => {
      // More robust runtime checking
      const runtime = window.chrome?.runtime;

      if (!runtime) {
        console.warn("Chrome runtime is not accessible");
        return;
      }

      try {
        runtime.sendMessage(
          "ikiihoimippalaflblnebhdkpkmnfbom",
          { type: "CHECK_INSTALLED" },
          (response?: ExtensionResponse) => {
            // Check for runtime errors first
            if (chrome.runtime.lastError) {
              console.warn(
                "Extension communication error:",
                chrome.runtime.lastError
              );
              setHasExtension(false);
              return;
            }

            // Then check the response
            setHasExtension(response?.installed ?? false);
          }
        );
      } catch (error) {
        console.error("Error checking extension:", error);
        setHasExtension(false);
      }
    };

    checkExtension();
  }, []);

  return hasExtension;
}

export default useHasExtension;
