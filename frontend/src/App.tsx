import { Outlet } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";

function App() {
  return (
    //00050ded
    <div className="w-full min-h-screen flex items-center justify-center bg-[#E9E9E9]  dark:bg-[#09090B] gap-6 p-6 md:p-10">
      <NavBar />

      <div className="pt-6 w-full flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
