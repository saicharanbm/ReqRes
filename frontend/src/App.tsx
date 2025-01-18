import { Outlet } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    //00050ded
    <div className="w-full min-h-screen flex items-center justify-center bg-muted dark:bg-[#18181B] gap-6 p-6 md:p-10">
      <NavBar />
      <GoogleOAuthProvider clientId={clientId}>
        <Outlet />
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
