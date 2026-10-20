"use client";

import { useEffect } from "react";

export function EmbedFlag() {
  useEffect(() => {
    const embed = new URLSearchParams(window.location.search).get("embed") === "1";
    document.documentElement.dataset.embed = embed ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.embed;
    };
  }, []);

  return null;
}
