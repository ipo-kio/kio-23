import React, { FC } from "react";

import { CardWrapper } from "../Card/CardWrapper/CardWrapper";

import css from "./Grid.module.css";

import { useAppSelector } from "../../services";
import { TCell } from "../../types/card";

export const Grid: FC = () => {
  const { cards } = useAppSelector(s => s.cards);

  return (
    <>
      <div className={css.grid}>
        {cards?.map((cell, i, arr) => {
          let startCard = false;
          let endCard = false;
          if (i === 0) startCard = true;
          if (i === arr.length - 1) endCard = true;
          return <CardWrapper key={i} index={i} cell={cell as TCell} startCard={startCard} endCard={endCard} />;
        })}
      </div>
    </>
  );
};
