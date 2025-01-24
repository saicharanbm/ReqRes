import { useEffect, useState } from "react";
function useHasExtention() {
  // Add state for extension status
  const [hasExtension, setHasExtension] = useState(false);

  // Check for extension on mount
  useEffect(() => {
    const checkExtension = () => {
      // Check for any Chromium-based browser's extension API
      if (window.chrome?.runtime || (window as any).browser?.runtime) {
        const runtime =
          window.chrome?.runtime || (window as any).browser?.runtime;

        // Try to communicate with extension
        runtime.sendMessage(
          "nbgnlealnfkpjabjpffdgodlojacdlaf",
          { type: "CHECK_INSTALLED" },
          (response) => {
            console.log(response);
            setHasExtension(!!response);
          }
        );
      }
    };

    checkExtension();
  }, []);

  return hasExtension;
}

export default useHasExtention;
