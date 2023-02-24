import { formatDateYYYY } from "@/helpers";
import { useState, useEffect } from "react";
import { useMemoizedCallback } from "../useMemoizedCallback";

export type DatepickerHookReturn = {
  date: Date,
  onDatepickerChange: (e: Date) => void,
  dateReturn: string
}

export const useDatepickerYYYY = (name: string, initialValue: string): DatepickerHookReturn => {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (initialValue) {
      setDate(new Date(Number(initialValue), 0, 1));
    } else {
      setDate(null);
    }
  }, [initialValue]);

  const onDatepickerChange = useMemoizedCallback((e: Date) => setDate(new Date(e)));
  const dateReturn = date ? formatDateYYYY(date) : null;
  return {
    date,
    onDatepickerChange,
    dateReturn
  }
}