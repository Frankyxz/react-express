let currentDate = new Date();

//Day
export const formattedDate = currentDate.toISOString().split("T")[0];
//Week
const startOfWeek = new Date(currentDate);
startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

const endOfWeek = new Date(currentDate);
endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 6);

if (endOfWeek.getMonth() !== currentDate.getMonth()) {
  endOfWeek.setMonth(currentDate.getMonth());
  endOfWeek.setDate(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  );
}
export const formattedStartWeek = startOfWeek.toISOString().split("T")[0];
export const formattedEndWeek = endOfWeek.toISOString().split("T")[0];

//Month
const firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  2
);

const lastDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  1
);

export const formattedStartMonth = firstDayOfMonth.toISOString().split("T")[0];
export const formattedEndMonth = lastDayOfMonth.toISOString().split("T")[0];

// Year
const currentYear = new Date().getFullYear();
const startYear = new Date(currentYear, 0, 2);
const endYear = new Date(currentYear, 11, 31, 23, 59, 59);

export const formattedStartYear = startYear.toISOString().split("T")[0];
export const formattedEndYear = endYear.toISOString().split("T")[0];
