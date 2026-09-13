import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.tsx"
import { fetchMe } from "./features/auth/slice/authSlice"
import { store } from "./store/store"
import { tokenStorage } from "./utils/token"

if (tokenStorage.get()) {
  void store.dispatch(fetchMe())
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
