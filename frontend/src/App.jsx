import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Router from "@/routes";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
        <ToastContainer
          autoClose={2000}
          rtl={false}
          closeOnClick
          draggable={false}
          newestOnTop={false}
          pauseOnHover={false}
          hideProgressBar={false}
          pauseOnFocusLoss={false}
          limit={3}
          theme="light"
          position="bottom-right"
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
