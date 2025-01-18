import { Outlet } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    //00050ded
    <div className="w-full min-h-screen flex items-center justify-center bg-[#FAFAFA]  dark:bg-[#09090B] gap-6 p-6 md:p-10">
      <NavBar />
      <GoogleOAuthProvider clientId={clientId}>
        <div className="pt-6 w-full flex justify-center items-center">
          <Outlet />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
