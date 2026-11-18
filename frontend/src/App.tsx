import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { apolloClient } from "./graphql/client";
import { AuthProvider } from "./contexts/AuthContext";
import { Root } from "./routes/Root";
import { PublicOnly } from "./routes/PublicOnly";
import { RequireAuth } from "./routes/RequireAuth";
import { Cadastro } from "./pages/Cadastro";
import { Transacoes } from "./pages/Transacoes";
import { Categorias } from "./pages/Categorias";
import { Perfil } from "./pages/Perfil";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Root />} />

            <Route element={<PublicOnly />}>
              <Route path="/cadastro" element={<Cadastro />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route path="/transacoes" element={<Transacoes />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
