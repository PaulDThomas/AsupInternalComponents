import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { Nav } from "./components/Nav";
import { BlockPage } from "./pages/BlockPage";
import { CurrentPage } from "./pages/CurrentPage";
import { EditorPage } from "./pages/EditorPage";
import { ExpanderPage } from "./pages/ExpanderPage";
import { ListPage } from "./pages/ListPage";
import { RowGroupPage } from "./pages/RowGroupPage";
import { TablePage } from "./pages/TablePage";
import { Table2 } from "./pages/TablePage2";
import { WindowPage } from "./pages/WindowPage";
import "./pages/pages.css";

export interface DemoPage {
  label: string;
  component: React.ReactNode;
}

const pages: DemoPage[] = [
  { label: "Current", component: <CurrentPage /> },
  { label: "Block", component: <BlockPage /> },
  { label: "Editor", component: <EditorPage /> },
  { label: "Expander", component: <ExpanderPage /> },
  { label: "List", component: <ListPage /> },
  { label: "RowGroups", component: <RowGroupPage /> },
  { label: "Table", component: <TablePage /> },
  { label: "DragTable", component: <Table2 /> },
  { label: "Window", component: <WindowPage /> },
];

const Root = () => {
  const location = useLocation();
  return location.pathname === "/" ? (
    <Navigate to="/current" />
  ) : (
    <div>
      <Nav pages={pages} />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: pages.map((page) => ({
      path: page.label.toLowerCase(),
      element: page.component,
      loader: async (props) => {
        console.log("loading", page.label, props);
        return null;
      },
    })),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
