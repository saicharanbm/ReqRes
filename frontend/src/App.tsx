import { Outlet } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
function App() {
  return (
    //00050ded
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 gap-6 p-6 md:p-10">
      {/* <Button>Shadcn</Button>*/}
      {/* <div className="flex w-full max-w-sm flex-col gap-6 "> */}
      <NavBar />
      <Outlet />
      {/* </div> */}
    </div>
  );
}

export default App;
