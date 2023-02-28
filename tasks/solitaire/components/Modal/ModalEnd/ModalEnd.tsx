import React from "react";
import { useAppSelector } from "../../../services";
import css from "./ModalEnd.module.css";

export const ModalEnd = () => {
	const { stats } = useAppSelector((s) => s.cards);
	const isAuth = useAppSelector((s) => s.user.isAuth);

	return (
		<section className={css.article}>
			<h1 className={css.article__title}>Поздравляем!</h1>
			<h2 className={css.article__subtitle}>Вы прошли игру!</h2>
			<h3 className={css.article__stats}>Статистика:</h3>
			<ul className={css.article__list}>
				<li>Длина: {stats.length}</li>
				<li>Шаги: {stats.steps}</li>
				<li>Сбросы: {stats.drops}</li>
			</ul>
		</section>
	);
};
