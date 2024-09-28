import dayjs, { type Dayjs } from "dayjs";

type DateFormatter = {
  asYear: (dateOrString: string | Dayjs) => string;
  asMonthAndYear: (dateOrString: string | Dayjs) => string;
};

export const date = (dateOrString: string | Dayjs): Dayjs =>
  dayjs(dateOrString);

export const now = (): Dayjs => dayjs();

export const dateFormatter: DateFormatter = {
  asYear: (dateOrString) => date(dateOrString).format("YYYY"),
  asMonthAndYear: (dateOrString) => date(dateOrString).format("MMM YYYY"),
};
