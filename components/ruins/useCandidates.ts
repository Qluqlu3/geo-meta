"use client";

import { useCallback, useEffect, useState } from "react";
import type { Ruin } from "@/data/ruins";

// 新旧比較で見つけた「候補」を、閲覧者のブラウザ内(localStorage)に一時保存する。
// サーバーには送らない。書き出した JSON を data/ruins.ts の curatedRuins に貼り付けて
// 正式なレコードにする運用(静的サイトのため、共有データベースは持たない)。

/** 候補は正式レコードと同じ形で持ち、そのまま書き出せるようにする */
export type Candidate = Ruin;

const KEY = "ruins-candidates-v1";

function load(): Candidate[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(list: Candidate[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // プライベートブラウズ等で保存できない場合は、このタブの中だけで保持する
  }
}

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    setCandidates(load());
  }, []);

  const commit = useCallback((next: (prev: Candidate[]) => Candidate[]) => {
    setCandidates((prev) => {
      const list = next(prev);
      save(list);
      return list;
    });
  }, []);

  const add = useCallback((c: Candidate) => commit((prev) => [...prev, c]), [commit]);
  const update = useCallback(
    (id: string, patch: Partial<Candidate>) => commit((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [commit],
  );
  const remove = useCallback((id: string) => commit((prev) => prev.filter((c) => c.id !== id)), [commit]);
  const clear = useCallback(() => commit(() => []), [commit]);

  return { candidates, add, update, remove, clear };
}
