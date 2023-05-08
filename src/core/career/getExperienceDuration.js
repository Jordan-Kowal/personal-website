import { date, dateFormatter, now } from '@/services/dates';

const computeDurationAsString = (startDate, endDate) => {
  const start = date(startDate);
  const end = endDate ? date(endDate) : now();
  const months = end.diff(start, 'month');
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  let text = '';
  if (years > 0) text += `${years} year${years > 1 ? 's' : ''}`;
  if (remainingMonths > 0) {
    text += ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  }
  return text.trim();
};

const getExperienceDuration = ({ startDate, endDate }) => {
  const text = !endDate
    ? `Since ${dateFormatter.asMonthAndYear(startDate)}`
    : `${dateFormatter.asMonthAndYear(
        startDate
      )} - ${dateFormatter.asMonthAndYear(endDate)}`;
  return `${text} (${computeDurationAsString(startDate, endDate)})`;
};

export default getExperienceDuration;
