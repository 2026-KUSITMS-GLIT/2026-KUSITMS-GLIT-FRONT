"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { selectableRecordsQueryOptions } from "@/lib/query/queryOptions";
import type { DailySelectableRecord } from "@/types/report/report";

export type SelectableRecord = DailySelectableRecord & { date: string };

export const useSelectableRecordsByDate = (dateKey: string) =>
  useQuery(selectableRecordsQueryOptions(dateKey));

export const useSelectableRecords = (
  initialRecords: SelectableRecord[] = [],
  dateKey: string,
) => {
  const [allRecords, setAllRecords] = useState<SelectableRecord[]>(initialRecords);
  const dateQuery = useSelectableRecordsByDate(dateKey);

  useEffect(() => {
    if (!dateKey || dateQuery.data === undefined) return;

    const records = dateQuery.data;
    setAllRecords(prev => {
      const existingIds = new Set(prev.map(record => record.starRecordId));
      const newRecords = records
        .filter(record => !existingIds.has(record.starRecordId))
        .map(record => ({ ...record, date: dateKey }));

      return newRecords.length > 0 ? [...prev, ...newRecords] : prev;
    });
  }, [dateKey, dateQuery.data]);

  return {
    dateRecords: dateQuery.data ?? [],
    allRecords,
    isLoading: dateQuery.isPending,
    isFetching: dateQuery.isFetching,
  };
};
