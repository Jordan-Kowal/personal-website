import dayjs from "dayjs";
import { getExperienceDuration } from "./getExperienceDuration";

describe("core/career/getExperienceDuration", () => {
  it("should return range if end date is provided", () => {
    const startDate = dayjs("2018-01-01");
    const endDate = dayjs("2019-04-01");
    expect(getExperienceDuration({ startDate, endDate })).toEqual(
      "Jan 2018 - Apr 2019 (1 year 3 months)",
    );
  });

  it('should return "since" if end date is not provided', () => {
    const startDate = dayjs().subtract(1, "year").subtract(4, "months");
    expect(getExperienceDuration({ startDate })).toEqual(
      `Since ${startDate.format("MMM YYYY")} (1 year 4 months)`,
    );
  });
});
