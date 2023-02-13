export function addLeadingZero(value: number): string {
  return value > 10 ? value.toString() : `0${value}`;
}

/**
 * A helper to transform date to the string value readable by HTML date input.
 * If no value is passed, current Date() is used.
 */
export function parseDateForDatepicker(value?: string): string {
  const dateObj = value ? new Date(value) : new Date();
  const yyyy = dateObj.getFullYear();
  const mm = dateObj.getMonth() + 1;
  const dd = dateObj.getDate();
  const parsedDate = `${yyyy}-${addLeadingZero(mm)}-${addLeadingZero(dd)}`;
  return parsedDate;
}
