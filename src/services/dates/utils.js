import dayjs from "dayjs";

export const date = (str) => dayjs(str);
export const now = () => dayjs();

export const dateFormatter = {
  asYear: (dateString) => date(dateString).format("YYYY"),
  asMonthAndYear: (dateString) => date(dateString).format("MMM YYYY"),
};
