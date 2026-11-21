"use client";

import { useCallback, useSyncExternalStore } from "react";

// Favoritos guardados en el navegador. Cuando haya cuentas de usuario, se sincronizarán con la base de datos.
const KEY = "trimapa:saved";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(v) ? v : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* almacenamiento no disponible */
  }
  listeners.forEach((l) => l());
}

const EMPTY: string[] = [];

export function useSaved() {
  const saved = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
  const toggle = useCallback((slug: string) => {
    const cur = read();
    write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  }, []);
  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);
  return { saved, toggle, isSaved };
}
