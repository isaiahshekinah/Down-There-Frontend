
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, CalendarDays, Droplets, Flower2, Heart } from "lucide-react";

import { useAuth } from "../context/AuthContexts";
import { getCyclePredictions } from "../services/cycleService";

function parseDate(dateString) {
  if (!dateString) return null;

  const [year, month, day] = String(dateString)
    .slice(0, 10)
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function daysBetween(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end) return null;

  return Math.round(
    (end - start) / (1000 * 60 * 60 * 24)
  );
}

function formatDate(dateString) {
  const date = parseDate(dateString);

  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function createNotifications(predictions) {
  if (!predictions) return [];

  const notifications = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const nextPeriod = predictions.nextPeriod?.start;
  const daysUntilPeriod = daysBetween(todayString, nextPeriod);

  if (daysUntilPeriod !== null) {
    if (daysUntilPeriod < 0) {
      notifications.push({
        id: "period-overdue",
        icon: Droplets,
        title: "Your period may be overdue",
        message: `Your predicted period date was ${formatDate(nextPeriod)}. Cycles can vary, so record your period when it begins.`,
        color: "text-rose-600",
        background: "bg-rose-50",
      });
    } else if (daysUntilPeriod === 0) {
      notifications.push({
        id: "period-today",
        icon: Droplets,
        title: "Your period is predicted today",
        message: "Your estimated period start date is today. Remember to record it when it begins.",
        color: "text-rose-600",
        background: "bg-rose-50",
      });
    } else if (daysUntilPeriod <= 3) {
      notifications.push({
        id: "period-coming",
        icon: CalendarDays,
        title: "Your period is approaching",
        message: `Your next period is predicted in ${daysUntilPeriod} day${daysUntilPeriod === 1 ? "" : "s"} (${formatDate(nextPeriod)}).`,
        color: "text-rose-600",
        background: "bg-rose-50",
      });
    }
  }

  const fertileStart = predictions.fertileWindow?.start;
  const fertileEnd = predictions.fertileWindow?.end;

  if (fertileStart && fertileEnd) {
    const daysUntilFertile = daysBetween(todayString, fertileStart);

    const isCurrentlyFertile =
      todayString >= fertileStart && todayString <= fertileEnd;

    if (isCurrentlyFertile) {
      notifications.push({
        id: "fertile-window-active",
        icon: Flower2,
        title: "Estimated fertile window",
        message: "You are currently within your estimated fertile window.",
        color: "text-purple-600",
        background: "bg-purple-50",
      });
    } else if (daysUntilFertile === 1) {
      notifications.push({
        id: "fertile-window-coming",
        icon: Flower2,
        title: "Fertile window approaching",
        message: "Your estimated fertile window may begin tomorrow.",
        color: "text-purple-600",
        background: "bg-purple-50",
      });
    }
  }

  if (predictions.ovulation === todayString) {
    notifications.push({
      id: "ovulation-day",
      icon: Heart,
      title: "Estimated ovulation day",
      message: "Today is your predicted ovulation day.",
      color: "text-pink-600",
      background: "bg-pink-50",
    });
  }

  return notifications;
}

export default function Header({ onMenuClick }) {
  const { user, token } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState("");

  const initial = user?.email?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoadingNotifications(true);
        setNotificationError("");

        const result = await getCyclePredictions(token);

        setPredictions(result);
      } catch (error) {
        setNotificationError(
          error.message || "Unable to load notifications."
        );
      } finally {
        setLoadingNotifications(false);
      }
    }

    if (token) {
      loadNotifications();
    }
  }, [token]);

  const notifications = createNotifications(predictions);

  return (
    <header className="h-20 top-0 sticky bg-white border-b border-rose-100 flex items-center justify-between px-4 sm:px-4 lg:px-8">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-600 hover:text-rose-600"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-rose-950">
            Welcome back!
          </h2>

          <p className="md:flex hidden text-xs sm:text-sm text-gray-400">
            Here's an overview of your cycle.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">

        <div className="relative">

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative mt-3 text-gray-400 hover:text-rose-600 transition"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={21} />

            {notifications.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 max-w-[90vw] bg-white border border-rose-100 rounded-xl shadow-xl z-50 overflow-hidden">

              <div className="flex items-center justify-between p-4 border-b border-rose-100">
                <h3 className="font-semibold text-rose-950">
                  Notifications
                </h3>

                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-rose-600 text-sm"
                >
                  Close
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-3">

                {loadingNotifications ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500">
                      Loading your reminders...
                    </p>
                  </div>
                ) : notificationError ? (
                  <div className="py-8 text-center">
                    <Bell size={24} className="text-rose-400 mx-auto mb-3" />

                    <p className="text-sm text-gray-600">
                      Unable to load your notifications.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {notificationError}
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell size={22} className="text-rose-400" />
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      You're all caught up!
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Your cycle reminders will appear here when available.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => {
                      const Icon = notification.icon;

                      return (
                        <div
                          key={notification.id}
                          className="flex gap-3 p-3 rounded-xl border border-gray-100"
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${notification.background}`}
                          >
                            <Icon
                              size={20}
                              className={notification.color}
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800">
                              {notification.title}
                            </h4>

                            <p className="text-xs text-gray-500 leading-5 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-rose-100 p-3">
                <p className="text-[11px] text-gray-400 text-center">
                  Cycle predictions are estimates and may vary.
                  Fertile-window estimates are not reliable contraception.
                </p>
              </div>

            </div>
          )}
        </div>

        <Link to="/settings">

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-semibold">
          {initial}
        </div>

        </Link>

      </div>
    </header>
  );
}
