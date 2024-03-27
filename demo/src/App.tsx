import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BlockPage } from "./pages/BlockPage";
import { CurrentPage } from "./pages/CurrentPage";
import { EditorPage } from "./pages/EditorPage";
import { ExpanderPage } from "./pages/ExpanderPage";
import { ListPage } from "./pages/ListPage";
import { RowGroupPage } from "./pages/RowGroupPage";
import { TablePage } from "./pages/TablePage";
import { WindowPage } from "./pages/WindowPage";
import "./pages/pages.css";
import { Nav } from "./components/Nav";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={<CurrentPage />}
        />
        <Route
          path="/block"
          element={<BlockPage />}
        />
        <Route
          path="/editor"
          element={<EditorPage />}
        />
        <Route
          path="/expander"
          element={<ExpanderPage />}
        />
        <Route
          path="/list"
          element={<ListPage />}
        />
        <Route
          path="/rowgroup"
          element={<RowGroupPage />}
        />
        <Route
          path="/table"
          element={<TablePage />}
        />
        <Route
          path="/window"
          element={<WindowPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
