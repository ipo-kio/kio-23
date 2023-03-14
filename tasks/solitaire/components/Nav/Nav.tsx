import React, { FC } from "react";
import { clx } from "../../utils/clx";

import css from "./Nav.module.css";

import { useAppDispatch, useAppSelector } from "../../services";
import { restoreSnapshot } from "../../services/slices/cards";
import { NavButton } from "./NavButton/NavButton";

export const Nav: FC = () => {
  const dispatch = useAppDispatch();
  const basePath = useAppSelector(s => s.user.basePath);
  return (
    <div className={clx(css.nav)}>
      <ul className={clx(css.nav__list)}>
        <NavButton onClick={() => dispatch(restoreSnapshot())} title="Отменить действие">
          <img src={`${basePath}/solitaire-resources/back.svg`} className={clx(css.nav__img)} alt="Отменить действие" />
        </NavButton>
      </ul>
    </div>
  );
};
