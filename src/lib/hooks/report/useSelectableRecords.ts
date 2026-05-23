"use client";

import { useCallback, useRef, useState } from "react";

import { getSelectableRecords } from "@/lib/apis/report/report";
import type { DailySelectableRecord } from "@/types/report/report";

export type SelectableRecord = DailySelectableRecord & { date: string };

// 날짜별 심화 기록 조회 및 캐싱을 담당하는 커스텀 훅
export const useSelectableRecords = () => {
  const [dateRecords, setDateRecords] = useState<DailySelectableRecord[]>([]);
  const [allRecords, setAllRecords] = useState<SelectableRecord[]>([]);
  const cacheRef = useRef<Map<string, DailySelectableRecord[]>>(new Map());

  const fetchByDate = useCallback(async (date: string) => {
    if (cacheRef.current.has(date)) {
      setDateRecords(cacheRef.current.get(date)!);
      return;
    }

    const data = await getSelectableRecords(date);
    const records: DailySelectableRecord[] = data?.starRecords ?? [];
    cacheRef.current.set(date, records);
    setDateRecords(records);
    setAllRecords(prev => [...prev, ...records.map(r => ({ ...r, date }))]);
  }, []);

  return { dateRecords, allRecords, fetchByDate };
};
