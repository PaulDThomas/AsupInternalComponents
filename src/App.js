import { RowGroupPage } from 'pages/RowGroupPage';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { BlockPage } from './pages/BlockPage';
import { EditorPage } from './pages/EditorPage';
import { ExpanderPage } from './pages/ExpanderPage';
import { ListPage } from './pages/ListPage';
import "./pages/pages.css";
import { TablePage } from './pages/TablePage';
import { WindowPage } from './pages/WindowPage';

const activeClass = ({ isActive }) => (isActive ? 'active' : 'inactive');

function App() {

  return (
    <BrowserRouter>
      <div>

        <nav>
          <ul>
            <li><NavLink to="/internalcomponents/" className={activeClass}>Current</NavLink></li>
            <li><NavLink to="/internalcomponents/block" className={activeClass}>TiFo block</NavLink></li>
            <li><NavLink to="/internalcomponents/list" className={activeClass}>Lists</NavLink></li>
            <li><NavLink to="/internalcomponents/rowgroup" className={activeClass}>RowGroups</NavLink></li>
            <li><NavLink to="/internalcomponents/table" className={activeClass}>Table</NavLink></li>
            <li><NavLink to="/internalcomponents/editor" className={activeClass}>Editor</NavLink></li>
            <li><NavLink to="/internalcomponents/expander" className={activeClass}>Expander</NavLink></li>
            <li><NavLink to="/internalcomponents/window" className={activeClass}>Window</NavLink></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate replace to="/internalcomponents/" />} />
          <Route path="/internalcomponents/" element={<TablePage />} />
          <Route path="/internalcomponents/block" element={<BlockPage />} />
          <Route path="/internalcomponents/editor" element={<EditorPage />} />
          <Route path="/internalcomponents/expander" element={<ExpanderPage />} />
          <Route path="/internalcomponents/list" element={<ListPage />} />
          <Route path="/internalcomponents/rowgroup" element={<RowGroupPage />} />
          <Route path="/internalcomponents/table" element={<TablePage />} />
          <Route path="/internalcomponents/window" element={<WindowPage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
