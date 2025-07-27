import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(isToday);
dayjs.extend(localizedFormat);

export function formatTaskDate(dateStr?: string): string {
  if (!dateStr) return "";

  const date = dayjs(dateStr);
  if (date.isToday()) {
    return `Today, ${date.format("HH:mm")}`;
  }

  if (date.isSame(dayjs(), "year")) {
    return date.format("D MMMM, HH:mm");
  }

  return date.format("D MMMM YYYY");
}
