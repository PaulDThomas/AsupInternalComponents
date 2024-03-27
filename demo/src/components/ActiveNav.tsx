import { NavLink } from "react-router-dom";

export const ActiveNav = (props: { to: string; label: string }): JSX.Element => {
  return (
    <li>
      <NavLink
        to={props.to}
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        {props.label}
      </NavLink>
    </li>
  );
};
