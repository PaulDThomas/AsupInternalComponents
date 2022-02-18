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

const activeClass = ({ isActive }) => (isActive ? 'active' : 'inactive');

function App() {

  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li><NavLink to="/"       className={activeClass}>Current</NavLink></li>
            <li><NavLink to="/table"  className={activeClass}>Table  </NavLink></li>
            <li><NavLink to="/editor" className={activeClass}>Editor </NavLink></li>
            <li><NavLink to="/window" className={activeClass}>Window </NavLink></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/"         element={<TablePage />   } />
          <Route path="/table"    element={<TablePage />   } />
          <Route path="/editor"   element={<EditorPage />  } />
          <Route path="/expander" element={<ExpanderPage />} />
          <Route path="/window"   element={<WindowPage />  } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
