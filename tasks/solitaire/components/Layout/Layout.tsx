import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { useEffectWithImports } from "../../hooks/useEffetchWithImports";
import { useAppDispatch } from "../../services";
import { setUser } from "../../services/slices/user";
import Toasts from "../Toasts/Toasts";

interface ILayout {
	title?: string;
	onlyAuth?: boolean;
	onlyAnonym?: boolean;
}

export const Layout: FC<PropsWithChildren<ILayout>> = ({ children }) => {
	return (
		<>
			{children}
			<Toasts />
		</>
	);
};
