import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/Theme.css"
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./pages/auth/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
