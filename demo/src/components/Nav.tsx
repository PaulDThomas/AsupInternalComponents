import { DemoPage } from "../App";
import { ActiveNav } from "./ActiveNav";

interface NavProps {
  pages: DemoPage[];
}

export const Nav = ({ pages }: NavProps) => (
  <nav>
    <ul>
      {pages.map((page, ix) => {
        return (
          <ActiveNav
            key={ix}
            to={`/${page.label.toLowerCase()}`}
            label={page.label}
          />
        );
      })}
    </ul>
  </nav>
);
