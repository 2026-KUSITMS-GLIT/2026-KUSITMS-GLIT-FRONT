import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import CalendarPageClient from "@/app/calendar/CalendarPageClient";
import { getServerQueryClient } from "@/lib/query/getServerQueryClient";
import {
  calendarDailyPreviewQueryOptions,
  calendarMonthlyQueryOptions,
} from "@/lib/query/queryOptions";
import { formatMonthKey, toDateKey } from "@/lib/utils/calendar";

const Page = async () => {
  const today = new Date();
  const monthKey = formatMonthKey(today);
  const dateKey = toDateKey(today);
  const queryClient = getServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(calendarMonthlyQueryOptions(monthKey)),
    queryClient.prefetchQuery(calendarDailyPreviewQueryOptions(dateKey)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CalendarPageClient todayIso={today.toISOString()} />
    </HydrationBoundary>
  );
};

export default Page;
