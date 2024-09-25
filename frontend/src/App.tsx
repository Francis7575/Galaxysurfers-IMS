import { IRouterType } from './types/types';
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from "react";
import { PAGE_DATA } from "./utils/pageData";
import LoadingPage from "./pages/LoadingPage";

const renderRoutes = (routes: IRouterType[]) => {
  return routes.map(({ title, path, element, children = [] }: IRouterType) => (
    <Route key={title} path={path} element={element}>
      {children.length > 0 && renderRoutes(children)}
    </Route>
  ));
};

const PageRouter = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ToastContainer />
      <Routes>{renderRoutes(PAGE_DATA)}</Routes>
    </Suspense>
  );
};

const App = () => {
  return <PageRouter />;
};

export default App;