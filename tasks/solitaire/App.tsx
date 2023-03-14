import React, { FC, useEffect } from "react";

import { DragOverlay } from "@dnd-kit/core";

import { CardWrapper } from "./components/Card/CardWrapper/CardWrapper";
import { Grid } from "./components/Grid/Grid";
import Context from "./components/Layout/Context";
import { Layout } from "./components/Layout/Layout";
import { Stats } from "./components/Stats/Stats";

import { useAppDispatch, useAppSelector } from "./services";
import { setCards, setDragMode, setStats, setSnapshots, closeModal } from "./services/slices/cards";

import css from "./index.module.css";
import { LOCAL_CARDS, MAPID, startCards } from "./constants/card";
import { Modal } from "./components/Modal/Modal";
import { ModalEnd } from "./components/Modal/ModalEnd/ModalEnd";
import { Nav } from "./components/Nav/Nav";
import { KioApi } from "../KioApi";

interface AppType {
  api: KioApi;
}

export const App: FC<AppType> = () => {
  const dispatch = useAppDispatch();
  const { cards, dragCards, isShowEndModal } = useAppSelector(s => s.cards);

  useEffect(() => {
    dispatch(setDragMode(false));
  }, [dispatch]);

  return (
    <Layout>
      <div className={css.header}>
        <div className={css.header__wrapper}>
          <Nav />
        </div>
      </div>
      <main className={css.main}>
        <Context cards={cards}>
          <Grid />
          <DragOverlay>
            {dragCards && <CardWrapper isUpFocus index={0} cell={dragCards} endCard startCard />}
          </DragOverlay>
        </Context>
      </main>
      <Modal
        open={isShowEndModal}
        onClose={() => {
          dispatch(closeModal());
        }}
      >
        <ModalEnd />
      </Modal>
    </Layout>
  );
};
