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
            <li><NavLink to="/ait/"         className={activeClass}>Current </NavLink></li>
            <li><NavLink to="/ait/table"    className={activeClass}>Table   </NavLink></li>
            <li><NavLink to="/ait/expander" className={activeClass}>Expander</NavLink></li>
            <li><NavLink to="/ait/editor"   className={activeClass}>Editor  </NavLink></li>
            <li><NavLink to="/ait/window"   className={activeClass}>Window  </NavLink></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/"             element={<TablePage />   } />
          <Route path="/ait/"         element={<TablePage />   } />
          <Route path="/ait/table"    element={<TablePage />   } />
          <Route path="/ait/editor"   element={<EditorPage />  } />
          <Route path="/ait/expander" element={<ExpanderPage />} />
          <Route path="/ait/window"   element={<WindowPage />  } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
