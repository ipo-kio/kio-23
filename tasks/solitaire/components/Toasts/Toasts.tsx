import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import css from "./Toasts.module.css";
import { Toast } from "./Toast/Toast";
import { useAppSelector } from "../../services";
import { useMounted } from "../../hooks/useMounted";

function Toasts() {
  const isMounted = useMounted();
  const toastsContent = useAppSelector(s => s.toast);

  if (typeof window === "undefined" || !isMounted) {
    return null;
  }

  const el = document.getElementById("toasts") as HTMLDivElement;

  return null;
}

export default Toasts;
