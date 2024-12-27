import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from "react";
import { PAGE_DATA } from "./utils/pageData";
import LoadingPage from "./pages/LoadingPage";
import { RouterProvider } from "react-router-dom"

const App = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ToastContainer />
      <RouterProvider router={PAGE_DATA} />
    </Suspense>
  );
};

export default App;