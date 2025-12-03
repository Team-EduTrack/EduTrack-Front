import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";

type AttendanceStatus = "present" | "absent";

interface Props {
  attendance: Record<string, AttendanceStatus>;
  className?: string;
}

export default function AttendanceCalendar({ attendance }: Props) {
  const presentDays = Object.keys(attendance)
    .filter((d) => attendance[d] === "present")
    .map((d) => new Date(d));

  const absentDays = Object.keys(attendance)
    .filter((d) => attendance[d] === "absent")
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
