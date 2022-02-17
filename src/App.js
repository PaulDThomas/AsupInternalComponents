import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom';
import { EditorPage } from './pages/EditorPage';
import { TablePage } from './pages/TablePage';
import "./pages/pages.css";
import { WindowPage } from './pages/WindowPage';
import { ExpanderPage } from 'pages/ExpanderPage';

function App() {

  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                Current
              </NavLink>
            </li>
            <li>
              <NavLink to="/table" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                Table
              </NavLink>
            </li>
            <li>
              <NavLink to="/editor" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                Editor
              </NavLink>
            </li>
            <li>
              <NavLink to="/window" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                Window
              </NavLink>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/expander" element={<ExpanderPage />} />
          <Route path="/window" element={<WindowPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
