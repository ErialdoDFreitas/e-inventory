import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import {Sidebar} from "./components/Sidebar.tsx";
import {AppRoutes} from "./AppRoutes.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, refetchOnWindowFocus: false
      },
    },
});


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>

          <div className="app-layout">
            <Sidebar />
            <main className="content">
              <AppRoutes />
            </main>
        </div>

      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;