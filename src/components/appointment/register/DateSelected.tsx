import { formatDate } from "@/lib/utils";

type DateSelectedProps = {
  date: string;
  time?: string;
};

export default function DateSelected({ date, time }: DateSelectedProps) {
  const formattedDate = formatDate(date); // uso de la función reutilizable

  return (
    <div className="mt-3 p-4 rounded-md bg-gray-100 border border-gray-200 text-myPurple-focus text-sm shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="text-myPurple-focus/70">
            Fecha: <span className="font-medium capitalize">{formattedDate}</span>
          </p>
        </div>

        {time && (
          <div className="flex items-center mt-1 gap-2">
            <p className="text-myPurple-focus/70">
              Hora: <span className="font-medium">{time}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
