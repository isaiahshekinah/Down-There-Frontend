import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  CalendarDays,
  Droplets,
  Heart,
  Activity,
  ArrowRight,
  Flower2,
  BookOpen,
  Stethoscope,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContexts";
import { getCyclePredictions } from "../services/cycleService";

function parseDate(dateString) {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const date = parseDate(dateString);

  if (!date) return "Not available";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysBetween(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end) return 0;

  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

function getCycleDay(date, lastPeriodStart) {
  return daysBetween(lastPeriodStart, date) + 1;
}

function getPhaseLabel(start, end, lastPeriodStart) {
  if (!start || !end || !lastPeriodStart) {
    return "Not available";
  }

  const firstDay = getCycleDay(start, lastPeriodStart);
  const lastDay = getCycleDay(end, lastPeriodStart);

  return firstDay === lastDay
    ? `Day ${firstDay}`
    : `Days ${firstDay}–${lastDay}`;
}

function getDateStatus(start, end, today) {
  if (!start || !end) return "Not available";

  if (today < start) return "Upcoming";

  if (today > end) return "Completed";

  if (today >= start && today <= end) return "Today";

  return "Not available";
}

export default function Dashboard() {
  const { token } = useAuth();

  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function loadPredictions() {
      try {
        setLoading(true);
        setError("");

        const result = await getCyclePredictions(token);

        setPredictions(result);
      } catch (err) {
        setError(err.message || "Unable to load cycle predictions.");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadPredictions();
    }
  }, [token, retryCount]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-rose-600 font-medium">
          Loading your cycle information...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center">
        <Heart size={35} className="text-rose-500 mx-auto mb-4" />

        <h2 className="text-lg font-semibold text-rose-950">
          Something went wrong
        </h2>

        <p className="text-sm text-gray-500 mt-2">{error}</p>

        <button
          onClick={() => setRetryCount((previous) => previous + 1)}
          className="mt-5 bg-rose-600 text-white px-5 py-2 rounded-xl hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!predictions) return null;

  const {
    lastPeriodStart,
    cycleLength,
    currentPhase,
    daysOverdue,
    nextPeriod,
    cycleTimeline,
    ovulation,
    fertileWindow,
    predictionSource,
  } = predictions;

  const today = getTodayDate();

  const calculatedCycleDay =
    today >= lastPeriodStart ? getCycleDay(today, lastPeriodStart) : null;

  const currentCycleDay = calculatedCycleDay;

  const currentCyclePosition =
    currentCycleDay !== null
      ? Math.min(
          Math.max(((currentCycleDay - 0.5) / cycleLength) * 100, 0),
          100,
        )
      : null;

  const phaseNames = {
    menstrual: "Menstrual",
    follicular: "Follicular",
    ovulation: "Ovulation",
    luteal: "Luteal",
    upcoming_cycle: "Upcoming cycle",
    period_due: "Period due",
    period_overdue: "Period overdue",
  };

  const readablePhase = phaseNames[currentPhase] || currentPhase;

  const isInitialEstimate = predictionSource === "initial_estimate";

  const ovulationStatus = getDateStatus(ovulation, ovulation, today);

  const fertileWindowStatus = getDateStatus(
    fertileWindow?.start,
    fertileWindow?.end,
    today,
  );

  const summaryCards = [
    {
      title: "Current cycle day",
      value:
        currentCycleDay !== null ? `Day ${currentCycleDay}` : "Not started",
      description: "Based on your estimated or recorded start",
      icon: CalendarDays,
      color: "bg-rose-100 text-rose-600",
    },

    {
      title: "Next period",
      value: formatDate(nextPeriod?.start),
      description:
        daysOverdue > 0
          ? `${daysOverdue} days overdue`
          : "Predicted start date",
      icon: Droplets,
      color: "bg-pink-100 text-pink-600",
    },

    {
      title: "Cycle length",
      value: `${cycleLength} days`,
      description: "Your current cycle setting",
      icon: Activity,
      color: "bg-purple-100 text-purple-600",
    },

    {
      title: "Current phase",
      value: readablePhase,
      description:
        daysOverdue > 0
          ? "Period has not been recorded"
          : "Based on your cycle data",
      icon: Heart,
      color: "bg-orange-100 text-orange-600",
    },

    {
      title: "Fertile window",
      value: fertileWindow
        ? `${formatDate(fertileWindow.start)} – ${formatDate(fertileWindow.end)}`
        : "Not available",
      description:
        fertileWindowStatus === "Completed"
          ? "Estimated fertile window has passed"
          : fertileWindowStatus === "Today"
            ? "Within estimated fertile window"
            : "Estimated fertile days",
      icon: Flower2,
      color: "bg-fuchsia-100 text-fuchsia-600",
    },
  ];

  const phases = [
    {
      name: "Menstrual",
      dates: cycleTimeline?.menstrual,
      color: "bg-rose-500",
      dot: "bg-rose-500",
    },

    {
      name: "Follicular",
      dates: cycleTimeline?.follicular,
      color: "bg-orange-400",
      dot: "bg-orange-400",
    },

    {
      name: "Ovulation",
      dates: ovulation ? { start: ovulation, end: ovulation } : null,
      color: "bg-purple-400",
      dot: "bg-purple-400",
    },

    {
      name: "Luteal",
      dates: cycleTimeline?.luteal,
      color: "bg-amber-400",
      dot: "bg-amber-400",
    },
  ];

  const phaseSegments = phases.map((phase) => {
    if (!phase.dates?.start || !phase.dates?.end) {
      return {
        ...phase,
        duration: 0,
        width: 0,
      };
    }

    const duration = daysBetween(phase.dates.start, phase.dates.end) + 1;

    return {
      ...phase,
      duration,
      width: (duration / cycleLength) * 100,
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-rose-950">
          Your cycle overview
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Stay informed about your menstrual health.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 sm:gap-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{card.title}</p>

                  <h2 className="text-xl sm:text-2xl font-bold text-rose-950 mt-2">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">{card.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-rose-100">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-rose-950">
              Your cycle journey
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Follow your estimated cycle progression.
            </p>
          </div>

          <div className="relative pt-9 pb-2">
            {currentCyclePosition !== null && (
              <div
                className="absolute top-0 z-10 flex flex-col items-center"
                style={{
                  left: `${currentCyclePosition}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <span className="text-xs font-bold text-rose-700 whitespace-nowrap bg-rose-50 px-2 py-1 rounded-md">
                  Today · Day {currentCycleDay}
                </span>

                <div className="w-0.5 h-5 bg-rose-600" />
              </div>
            )}

            <div className="relative flex w-full h-5 rounded-full overflow-hidden bg-gray-100">
              {phaseSegments.map(
                (phase) =>
                  phase.width > 0 && (
                    <div
                      key={phase.name}
                      title={`${phase.name}: ${phase.duration} days`}
                      className={`${phase.color} h-full transition-all duration-500`}
                      style={{
                        width: `${phase.width}%`,
                        flexShrink: 0,
                      }}
                    />
                  ),
              )}
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>Day 1</span>

              <span>Day {Math.ceil(cycleLength / 2)}</span>

              <span>Day {cycleLength}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">
            {phaseSegments.map((phase) => (
              <div
                key={phase.name}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${phase.dot}`}
                  />

                  <span className="text-sm text-gray-600">{phase.name}</span>
                </div>

                <span className="text-xs text-gray-400 shrink-0">
                  {phase.dates
                    ? getPhaseLabel(
                        phase.dates.start,
                        phase.dates.end,
                        lastPeriodStart,
                      )
                    : "Not available"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 pt-5 border-t border-rose-100 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <p className="text-sm text-gray-600">Estimated ovulation</p>

                <p className="font-semibold text-rose-800 mt-1">
                  {formatDate(ovulation)}
                </p>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  ovulationStatus === "Completed"
                    ? "bg-gray-100 text-gray-500"
                    : ovulationStatus === "Today"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-purple-50 text-purple-600"
                }`}
              >
                {ovulationStatus === "Completed"
                  ? "Passed"
                  : ovulationStatus === "Today"
                    ? "Today"
                    : "Upcoming"}
              </span>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <p className="text-sm text-gray-600">
                  Estimated fertile window
                </p>

                <p className="font-semibold text-rose-800 mt-1">
                  {fertileWindow
                    ? `${formatDate(fertileWindow.start)} – ${formatDate(fertileWindow.end)}`
                    : "Not available"}
                </p>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  fertileWindowStatus === "Completed"
                    ? "bg-gray-100 text-gray-500"
                    : fertileWindowStatus === "Today"
                      ? "bg-fuchsia-100 text-fuchsia-700"
                      : "bg-fuchsia-50 text-fuchsia-600"
                }`}
              >
                {fertileWindowStatus === "Completed"
                  ? "Completed"
                  : fertileWindowStatus === "Today"
                    ? "In progress"
                    : "Upcoming"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 rounded-2xl p-7 border border-rose-100">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5">
            <Heart className="text-rose-600" size={24} />
          </div>

          <h2 className="text-lg font-semibold text-rose-950">
            Listen to your body
          </h2>

          <p className="text-sm text-gray-600 leading-6 mt-3">
            {daysOverdue > 0
              ? `Your predicted period date has passed by ${daysOverdue} days. Cycles can vary. Record your next period when it begins.`
              : "Keep paying attention to changes in your body. Your cycle predictions are estimates and may vary."}
          </p>

          <div className="mt-6 space-y-3">
            <Link
              to="/learn-cycle"
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={20} className="text-rose-600" />
                <span className="text-sm font-semibold text-rose-900">
                  Understand Your Cycle
                </span>
              </div>
              <ChevronRight size={19} className="text-rose-500" />
            </Link>

            <Link
              to="/doctor-guide"
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition"
            >
              <div className="flex items-center gap-3">
                <Stethoscope size={20} className="text-rose-600" />
                <span className="text-sm font-semibold text-rose-900">
                  When to See a Doctor
                </span>
              </div>
              <ChevronRight size={19} className="text-rose-500" />
            </Link>

            <Link
              to="/help-support"
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="text-rose-600" />
                <span className="text-sm font-semibold text-rose-900">
                  Help & Support
                </span>
              </div>
              <ChevronRight size={19} className="text-rose-500" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-6">
        <h2 className="font-semibold text-rose-950">About your predictions</h2>

        <p className="text-sm text-gray-600 mt-2 leading-6">
          {isInitialEstimate
            ? "These predictions are based on your saved cycle settings and expected next period date. Your previous period start is estimated, not a confirmed record."
            : "These predictions are based on the period dates you have recorded in the app."}
        </p>

        <p className="text-xs text-gray-400 mt-3">
          Cycle and fertile-window predictions are estimates, not guaranteed
          dates or reliable contraception.
        </p>
      </div>
    </div>
  );
}
