import dayjs from "dayjs";
import "dayjs/locale/fr";
import calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.extend(weekOfYear);
