import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";

interface Props {
  attendedDates: string[];
  totalClassDays?: number;
  year: number;
  month: number;
  className?: string;
}

export default function AttendanceCalendar({
  attendedDates,
  totalClassDays,
  year,
  month,
}: Props) {
  const attendanceMap: Record<string, "present" | "absent"> = {};

  if (totalClassDays) {
    for (let i = 1; i <= totalClassDays; i++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      attendanceMap[dateStr] = "absent";
    }
  }

  attendedDates?.forEach((d) => {
    attendanceMap[d] = "present";
  });

  const presentDays = Object.keys(attendanceMap)
    .filter((d) => attendanceMap[d] === "present")
    .map((d) => new Date(d));

  const absentDays = Object.keys(attendanceMap)
    .filter((d) => attendanceMap[d] === "absent")
    .map((d) => new Date(d));

  return (
    <DayPicker
      locale={ko}
      mode="single"
      modifiers={{
        present: presentDays,
        absent: absentDays,
      }}
      modifiersStyles={{
        present: {
          backgroundColor: "#10b981",
          borderRadius: "10px",
          color: "white",
        },
        absent: {
          backgroundColor: "#ef4444",
          borderRadius: "10px",
          color: "white",
        },
      }}
      className="rounded-lg p-4 shadow bg-base-100 mx-auto flex justify-center"
      weekStartsOn={0}
    />
  );
}
