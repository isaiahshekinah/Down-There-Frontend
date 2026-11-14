
import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Heart,
  LoaderCircle
} from "lucide-react";

import { useAuth } from "../context/AuthContexts";
import { getCyclePredictions } from "../services/cycleService";
import { API_BASE_URL } from "../services/api";


function parseDate(dateString) {
  if (!dateString) return null;

  const [year, month, day] = String(dateString)
    .slice(0, 10)
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}


function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function addDays(dateString, days) {
  const date = parseDate(dateString);

  if (!date) return null;

  date.setDate(date.getDate() + days);

  return toDateString(date);
}


function formatDate(dateString) {
  const date = parseDate(dateString);

  if (!date) return "Not available";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}


function getDateRange(start, end) {
  const dates = [];

  if (!start || !end) return dates;

  let current = start;

  while (current <= end) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}


export default function Calendar() {
  const { token } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [predictions, setPredictions] = useState(null);
  const [periods, setPeriods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const today = toDateString(new Date());

  useEffect(() => {
    async function loadCalendarData() {
      try {
        setLoading(true);
        setError("");

        const [predictionData, periodResponse] = await Promise.all([
          getCyclePredictions(token),

          fetch(`${API_BASE_URL}/periods`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        const periodData = await periodResponse.json();

        if (!periodResponse.ok) {
          throw new Error(
            periodData.message || "Unable to load recorded periods."
          );
        }

        setPredictions(predictionData);

        setPeriods(
          Array.isArray(periodData)
            ? periodData
            : periodData.periods || []
        );

      } catch (err) {
        setError(
          err.message || "Unable to load your calendar."
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadCalendarData();
    }

  }, [token, retryCount]);


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long"
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();


  function changeMonth(direction) {
    setCurrentDate(
      new Date(year, month + direction, 1)
    );

    setSelectedDate(null);
  }

  const calendarDates = useMemo(() => {
    const actualPeriodDates = new Set();
    const predictedPeriodDates = new Set();
    const fertileWindowDates = new Set();
    const ovulationDates = new Set();

    if (!predictions) {
      return {
        actualPeriodDates,
        predictedPeriodDates,
        fertileWindowDates,
        ovulationDates
      };
    }

    const periodLength = Number(predictions.periodLength) || 5;

    periods.forEach(period => {
      const start = String(period.start_date).slice(0, 10);

      const end = period.end_date
        ? String(period.end_date).slice(0, 10)
        : addDays(start, periodLength - 1);

      getDateRange(start, end).forEach(date => {
        actualPeriodDates.add(date);
      });
    });


    function addPredictedPeriod(start, end) {
      if (!start) return;

      const finalDate = end || addDays(start, periodLength - 1);

      getDateRange(start, finalDate).forEach(date => {
        if (!actualPeriodDates.has(date)) {
          predictedPeriodDates.add(date);
        }
      });
    }

    if (predictions.nextPeriod) {
      addPredictedPeriod(
        predictions.nextPeriod.start,
        predictions.nextPeriod.end
      );
    }

    (predictions.futureCycles || []).forEach(cycle => {
      addPredictedPeriod(
        cycle.start,
        cycle.end
      );

      if (cycle.ovulation) {
        ovulationDates.add(cycle.ovulation);

        const fertileStart = addDays(cycle.ovulation, -5);

        getDateRange(fertileStart, cycle.ovulation).forEach(date => {
          fertileWindowDates.add(date);
        });
      }
    });


    if (predictions.ovulation) {
      ovulationDates.add(predictions.ovulation);
    }

    if (predictions.fertileWindow) {
      getDateRange(
        predictions.fertileWindow.start,
        predictions.fertileWindow.end
      ).forEach(date => {
        fertileWindowDates.add(date);
      });
    }

    actualPeriodDates.forEach(date => {
      predictedPeriodDates.delete(date);
    });

    return {
      actualPeriodDates,
      predictedPeriodDates,
      fertileWindowDates,
      ovulationDates
    };

  }, [predictions, periods]);


  const selectedDateInfo = selectedDate
    ? {
        isPeriod: calendarDates.actualPeriodDates.has(selectedDate),
        isPredictedPeriod: calendarDates.predictedPeriodDates.has(selectedDate),
        isFertile: calendarDates.fertileWindowDates.has(selectedDate),
        isOvulation: calendarDates.ovulationDates.has(selectedDate)
      }
    : null;


  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <LoaderCircle className="animate-spin text-rose-600" size={30} />
        <p className="text-rose-600 font-medium">
          Loading your calendar...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center">

        <Heart size={35} className="text-rose-500 mx-auto mb-4" />

        <h2 className="text-lg font-semibold text-rose-950">
          Unable to load calendar
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          {error}
        </p>

        <button
          onClick={() => setRetryCount(previous => previous + 1)}
          className="mt-5 bg-rose-600 text-white px-5 py-2 rounded-xl hover:bg-rose-700"
        >
          Try again
        </button>

      </div>
    );
  }


  const emptyDays = Array.from(
    { length: firstDay },
    (_, index) => `empty-${index}`
  );

  const days = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  );


  return (
    <div className="space-y-6 sm:space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-rose-950">
          Cycle Calendar
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Keep track of your cycle and understand your patterns.
        </p>
      </div>


      <section className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 sm:p-7">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-rose-950">
              {monthName} {year}
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Select a date to view its cycle information.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={() => changeMonth(-1)}
              className="w-9 h-9 rounded-lg border border-rose-100 flex items-center justify-center text-gray-600 hover:bg-rose-50"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => changeMonth(1)}
              className="w-9 h-9 rounded-lg border border-rose-100 flex items-center justify-center text-gray-600 hover:bg-rose-50"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>

          </div>

        </div>


        <div className="grid grid-cols-7 mb-3">

          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (

            <div
              key={day}
              className="text-center text-xs sm:text-sm font-semibold text-gray-400 py-2"
            >
              {day}
            </div>

          ))}

        </div>

        <div className="grid grid-cols-7 gap-y-2">

          {emptyDays.map(day => (
            <div key={day} />
          ))}

          {days.map(day => {

            const dateKey =
              `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const isToday = dateKey === today;
            const isSelected = selectedDate === dateKey;

            const isPeriod =
              calendarDates.actualPeriodDates.has(dateKey);

            const isPredictedPeriod =
              calendarDates.predictedPeriodDates.has(dateKey);

            const isFertile =
              calendarDates.fertileWindowDates.has(dateKey);

            const isOvulation =
              calendarDates.ovulationDates.has(dateKey);


            let dateStyle = "text-gray-700 hover:bg-rose-50";

            if (isPeriod) {
              dateStyle = "bg-rose-600 text-white font-semibold";
            } else if (isPredictedPeriod) {
              dateStyle = "bg-rose-200 text-rose-900 font-semibold";
            } else if (isFertile) {
              dateStyle = "bg-blue-200 text-blue-900 font-semibold";
            }

            if (isOvulation && !isPeriod && !isPredictedPeriod) {
              dateStyle += " border-2 border-dashed border-blue-900";
            }

            return (

              <button
                key={day}
                onClick={() => setSelectedDate(dateKey)}
                title={dateKey}
                className={`
                  aspect-square w-10 max-w-12 mx-auto
                  rounded-full flex items-center justify-center
                  text-sm transition-all
                  ${dateStyle}
                  ${isToday ? "ring ring-rose-500 ring-offset-1" : ""}
                  ${isSelected ? " outline-2 outline-offset-4 outline-rose-700" : ""}
                `}
              >
                {day}
              </button>

            );

          })}

        </div>

        <div className="mt-6 p-4 bg-rose-50 rounded-xl">

          {selectedDate ? (

            <div>

              <h3 className="font-semibold text-rose-950">
                {formatDate(selectedDate)}
              </h3>

              <div className="text-sm text-gray-600 mt-2 space-y-1">

                {selectedDateInfo.isPeriod && (
                  <p className="text-rose-700 font-medium">
                    Recorded period day.
                  </p>
                )}

                {selectedDateInfo.isPredictedPeriod && (
                  <p className="text-rose-700 font-medium">
                    Predicted period day.
                  </p>
                )}

                {selectedDateInfo.isOvulation && (
                  <p className="text-blue-800 font-medium">
                    Estimated ovulation day.
                  </p>
                )}

                {selectedDateInfo.isFertile && (
                  <p className="text-blue-700 font-medium">
                    Within the estimated fertile window.
                  </p>
                )}

                {!selectedDateInfo.isPeriod &&
                  !selectedDateInfo.isPredictedPeriod &&
                  !selectedDateInfo.isOvulation &&
                  !selectedDateInfo.isFertile && (
                    <p>
                      No cycle information recorded for this date yet.
                    </p>
                  )}

                {selectedDate === today && (
                  <p className="text-rose-700 font-semibold">
                    Today.
                  </p>
                )}

              </div>

            </div>

          ) : (

            <div className="flex items-center gap-3">

              <CalendarDays className="text-rose-600" size={22} />

              <p className="text-sm text-gray-600">
                Select a date to view cycle information.
              </p>

            </div>

          )}

        </div>

      </section>


      <section className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 sm:p-7">

        <h2 className="font-bold text-rose-950 mb-5">
          Calendar legend
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-rose-600 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">
              Recorded period
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-rose-200 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">
              Predicted period
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-200 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">
              Fertile window
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-dashed border-blue-900 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">
              Ovulation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-rose-500 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">
              Today
            </span>
          </div>

        </div>

        <p className="text-xs text-gray-400 mt-5">
          Cycle and fertile-window dates are estimates and may change as more
          period history is recorded. They are not reliable contraception.
        </p>

      </section>

    </div>
  );
}
