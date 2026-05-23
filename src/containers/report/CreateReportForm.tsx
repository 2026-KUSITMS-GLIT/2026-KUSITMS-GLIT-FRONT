"use client";

import { useEffect, useState } from "react";

import { PlusIcon } from "@/assets/icons";
import CTA from "@/components/common/CTA";
import SelectedRecordSection from "@/containers/report/SelectedRecordSection";
import StarCalendarSection from "@/containers/report/StarCalendarSection";
import type { SelectableRecord } from "@/lib/hooks/report/useSelectableRecords";
import { useSelectableRecords } from "@/lib/hooks/report/useSelectableRecords";
import { fromDateKeys, toDateKey } from "@/lib/utils/calendar";
import type { SelectableInfo } from "@/types/report/report";

const MIN_SELECT: Record<SelectableInfo["reportType"], number> = { MINI: 10, CAREER: 20 };

const CreateReportForm = ({
  reportType,
  totalStarCount,
  autoSelectedStarRecordIds,
  starRecordDates,
}: SelectableInfo) => {
  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  // 선택된 심화기록 ID 집합
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(autoSelectedStarRecordIds),
  );

  const minSelect = MIN_SELECT[reportType];
  const canCreate =
    reportType === "MINI" ? selectedIds.size === minSelect : selectedIds.size >= minSelect;

  // 선택한 날짜 데이터
  const dateKey = toDateKey(selectedDate);
  const { dateRecords, allRecords, fetchByDate } = useSelectableRecords();

  const selectedIdItems: SelectableRecord[] = allRecords.filter(r =>
    selectedIds.has(r.starRecordId),
  );

  const toggle = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        // TODO: MINI 10개 초과 시도 시 경고 추가
        if (reportType === "MINI" && prev.size >= minSelect) return prev;
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    // TODO: 조건 미충족 시 경고 추가
    if (!canCreate) return;
  };

  useEffect(() => {
    fetchByDate(dateKey);
  }, [dateKey, fetchByDate]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hide flex-1 overflow-y-auto px-4">
        <StarCalendarSection
          selectedDate={selectedDate}
          scrumDates={fromDateKeys(starRecordDates)}
          dateRecords={dateRecords}
          selectedIds={selectedIds}
          onSelect={date => setSelectedDate(date ?? new Date())}
          onToggle={toggle}
        />

        <div className="px-0.75">
          <span className="head-5 mt-10.5 mb-5.5 block text-white">선택된 심화기록</span>
          <SelectedRecordSection
            items={selectedIdItems}
            totalCount={totalStarCount}
            selectedCount={selectedIds.size}
            isActive={canCreate}
          />
        </div>
      </div>

      <div className="mb-8.5 shrink-0 px-5">
        <CTA disabled={!canCreate} leftIcon={<PlusIcon />} onClick={handleGenerate}>
          리포트 생성
        </CTA>
      </div>
    </div>
  );
};

export default CreateReportForm;
