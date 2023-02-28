import React, { FC } from "react";
import { clx } from "../../utils/clx";

import css from "./Nav.module.css";

import { useAppDispatch } from "../../services";
import { restoreSnapshot } from "../../services/slices/cards";
import { NavButton } from "./NavButton/NavButton";

export const Nav: FC = () => {
  const dispacth = useAppDispatch();
  return (
    <nav className={clx(css.nav)}>
      <ul className={clx(css.nav__list)}>
        <NavButton onClick={() => dispacth(restoreSnapshot())} title="Отменить действие">
          <img src="./solitaire-resources/back.svg" alt="Отменить действие" />
        </NavButton>
      </ul>
    </nav>
  );
};
