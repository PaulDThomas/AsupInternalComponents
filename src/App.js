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
            <li><NavLink to="/ait/" className={activeClass}>Current</NavLink></li>
            <li><NavLink to="/ait/block" className={activeClass}>TiFo block</NavLink></li>
            <li><NavLink to="/ait/list" className={activeClass}>Lists</NavLink></li>
            <li><NavLink to="/ait/table" className={activeClass}>Table</NavLink></li>
            <li><NavLink to="/ait/editor" className={activeClass}>Editor</NavLink></li>
            <li><NavLink to="/ait/expander" className={activeClass}>Expander</NavLink></li>
            <li><NavLink to="/ait/window" className={activeClass}>Window</NavLink></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate replace to="/ait/" />} />
          <Route path="/ait/" element={<BlockPage />} />
          <Route path="/ait/block" element={<BlockPage />} />
          <Route path="/ait/editor" element={<EditorPage />} />
          <Route path="/ait/expander" element={<ExpanderPage />} />
          <Route path="/ait/list" element={<ListPage />} />
          <Route path="/ait/table" element={<TablePage />} />
          <Route path="/ait/window" element={<WindowPage />} />
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
