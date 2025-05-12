"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useReportWebVitals((metric) => {
    // console.log(metric)
  });

  return null;
}
