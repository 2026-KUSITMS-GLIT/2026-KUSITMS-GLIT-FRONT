function StarAnalysisDelayed() {
  return (
    <section className="relative -mx-5 flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-900 px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-18 h-58 w-58 animate-[star-complete-wave-top_3.2s_ease-in-out_infinite] rounded-full bg-red-400 opacity-40 blur-[112px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-14 -left-20 h-62 w-62 animate-[star-complete-wave-bottom_3.6s_ease-in-out_180ms_infinite] rounded-full bg-red-400 opacity-40 blur-[104px]"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <p className="animate-star-complete-copy head-4 text-white">다시 한 번 시도하는 중이에요</p>
        <p className="animate-star-complete-copy body-5 mt-1 text-gray-500">
          조금만 더 기다려주세요
        </p>
      </div>
    </section>
  );
}

export default StarAnalysisDelayed;
