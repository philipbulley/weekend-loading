import { useMemo, useEffect, useState } from "react";
import "./App.css";
import { DateTime } from "luxon";

type Workday = {
  dayIndex: number;
  startTime: string;
  endTime: string;
  start?: DateTime;
  end?: DateTime;
};

const workdays: Workday[] = [
  {
    dayIndex: 0,
    startTime: "09:00",
    endTime: "17:30",
  },
  {
    dayIndex: 1,
    startTime: "09:00",
    endTime: "17:30",
  },
  {
    dayIndex: 2,
    startTime: "09:00",
    endTime: "17:30",
  },
  {
    dayIndex: 3,
    startTime: "09:00",
    endTime: "17:30",
  },
  {
    dayIndex: 4,
    startTime: "09:00",
    endTime: "17:30",
  },
];

const calculate = () => {
  const now = DateTime.now();
  // const now = DateTime.fromISO('2024-06-25T17:29');
  const startOfWeek = DateTime.now().startOf("week");

  const { totalDuration, nowOffset } = workdays.reduce(
    (acc, workday) => {
      // Set up DateTime in relation to this week
      workday.start = DateTime.fromISO(
        `${startOfWeek
          .plus({ day: workday.dayIndex })
          .toFormat("yyyy-MM-dd")}T${workday.startTime}`
      );
      workday.end = DateTime.fromISO(
        `${startOfWeek
          .plus({ day: workday.dayIndex })
          .toFormat("yyyy-MM-dd")}T${workday.endTime}`
      );

      // Get total duration
      acc.totalDuration += workday.end.toSeconds() - workday.start.toSeconds();

      // Calc the offset of now into the week
      if (now.toSeconds() <= workday.start.toSeconds()) {
        // Now is before this workday
        acc.nowOffset += 0;
      } else if (now.toSeconds() <= workday.end.toSeconds()) {
        // Now is within this workday
        acc.nowOffset += now.toSeconds() - workday.start.toSeconds();
      } else {
        acc.nowOffset += workday.end.toSeconds() - workday.start.toSeconds();
      }

      return acc;
    },
    { totalDuration: 0, nowOffset: 0 }
  );

  const percentage = Math.floor((nowOffset / totalDuration) * 100);

  return { totalDuration, nowOffset, percentage };
};

function App() {
  const { percentage: initialPercentage } = useMemo(
    () => calculate(),
    [calculate]
  );
  const [percentage, setPercentage] = useState(initialPercentage);

  useEffect(() => {
    const interval = setInterval(() => {
      const { percentage: _percentage } = calculate();
      setPercentage(_percentage);
    }, 1000);

    return () => clearInterval(interval);
  }, [calculate]);

  const bgColorClass = percentage < 100 ? "bg-gray-800" : "bg-pink-500";
  const progressBackgroundColorClass =
    percentage < 100 ? "bg-blue-600" : "bg-yellow-400 text-black";

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${bgColorClass}`}
    >
      <div className="max-w-md m-4">
        {" "}
        <h1 className="mb-8 text-4xl font-bold text-center">
          {percentage < 100 ? (
            <div className="flex items-center gap-1">
              <div className="lds-spinner scale-75 -ml-4">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              Weekend loading...
            </div>
          ) : (
            <div>It's the weekend!</div>
          )}
        </h1>
        {/* <div>Percentage: {percentage}%</div> */}
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className={`text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full ${progressBackgroundColorClass}`}
            style={{ width: `${percentage}%` }}
          >
            {" "}
            {percentage}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
