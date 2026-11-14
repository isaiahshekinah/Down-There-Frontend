
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Heart, ArrowRight } from "lucide-react";

import { useAuth } from "../context/AuthContexts";
import { API_BASE_URL } from "../services/api";

export default function Setup() {
  const navigate = useNavigate();
  const { token, completeSetup } = useAuth();

  const [cycleLength, setCycleLength] = useState(30);
  const [periodLength, setPeriodLength] = useState(5);
  const [expectedNextPeriodDate, setExpectedNextPeriodDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!expectedNextPeriodDate) {
      setError("Please select your expected next period date.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/cycle/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cycleLength,
          periodLength,
          expectedNextPeriodDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save your information.");
      }

      completeSetup();
      navigate("/dashboard", { replace: true });

    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F8] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-xl">

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-rose-100 p-3 rounded-2xl">
            <Heart className="text-rose-600" size={25} />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Down <span className="text-rose-600">There</span>
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-6 sm:p-9">

          <div className="mb-8">
            <p className="text-sm font-semibold text-rose-600 mb-2">
              LET'S GET STARTED
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Let's understand your cycle
            </h2>

            <p className="text-gray-500 leading-relaxed">
              Tell us a little about your menstrual cycle so we can
              personalize your calendar and predictions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How long is your average cycle?
              </label>

              <select
                value={cycleLength}
                onChange={(event) =>
                  setCycleLength(Number(event.target.value))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              >
                {[28, 29, 30, 31, 32].map((days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-400 mt-2">
                Count from the first day of one period to the first day of the next.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How many days does your period usually last?
              </label>

              <select
                value={periodLength}
                onChange={(event) =>
                  setPeriodLength(Number(event.target.value))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              >
                {[4, 5, 6, 7].map((days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                When do you expect your next period?
              </label>

              <div className="relative">
                <CalendarDays
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400"
                />

                <input
                  type="date"
                  value={expectedNextPeriodDate}
                  onChange={(event) =>
                    setExpectedNextPeriodDate(event.target.value)
                  }
                  className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  required
                />
              </div>

              <p className="text-xs text-gray-400 mt-2">
                This helps us create your initial cycle predictions.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition"
            >
              {loading ? "Saving..." : "Save and continue"}

              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Your predictions are estimates and may vary from your actual cycle.
          </p>

        </div>
      </div>
    </div>
  );
}
