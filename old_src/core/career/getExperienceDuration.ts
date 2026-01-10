import type { Dayjs } from "dayjs";
import { date, dateFormatter, now } from "@/utils/dates";

type ComputeDurationAsString = (
  startDate: string | Dayjs,
  endDate?: string | Dayjs,
) => string;

const computeDurationAsString: ComputeDurationAsString = (
  startDate,
  endDate,
) => {
  const start = date(startDate);
  const end = endDate ? date(endDate) : now();
  const months = end.diff(start, "month");
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  let text = "";
  if (years > 0) text += `${years} year${years > 1 ? "s" : ""}`;
  if (remainingMonths > 0) {
    text += ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
  }
  if (text === "") text = "less than a month";
  return text.trim();
};

type GetExperienceDurationParams = {
  startDate: string | Dayjs;
  endDate?: string | Dayjs;
};

type GetExperienceDuration = (params: GetExperienceDurationParams) => string;
export const getExperienceDuration: GetExperienceDuration = ({
  startDate,
  endDate,
}) => {
  const text = !endDate
    ? `Since ${dateFormatter.asMonthAndYear(startDate)}`
    : `${dateFormatter.asMonthAndYear(
        startDate,
      )} - ${dateFormatter.asMonthAndYear(endDate)}`;
  return `${text} (${computeDurationAsString(startDate, endDate)})`;
};
