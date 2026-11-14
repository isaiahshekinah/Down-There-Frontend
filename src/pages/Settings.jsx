
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, User, CalendarDays, Lock } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";

import { useAuth } from "../context/AuthContexts";
import { API_BASE_URL } from "../services/api";

export default function Settings() {
  const { token, user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const firstTimeSetup = location.state?.firstTimeSetup === true;

  const [cycleLength, setCycleLength] = useState(30);
  const [periodLength, setPeriodLength] = useState(5);
  const [expectedNextPeriodDate, setExpectedNextPeriodDate] = useState("");

  const [hasSettings, setHasSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [passwordMessage, setPasswordMessage] = useState("");
const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/cycle/settings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 404) {
          setHasSettings(false);
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your settings.");
        }

        const settings = data.settings || data;

        if (
          settings.cycleLength != null ||
          settings.averageCycleLength != null ||
          settings.average_cycle_length != null
        ) {
          setCycleLength(
            Number(
              settings.cycleLength ??
              settings.averageCycleLength ??
              settings.average_cycle_length
            )
          );

          setPeriodLength(
            Number(
              settings.periodLength ??
              settings.averagePeriodLength ??
              settings.average_period_length
            )
          );

          setExpectedNextPeriodDate(
            settings.expectedNextPeriodDate ||
            settings.initialNextPeriodDate ||
            settings.initial_next_period_date ||
            ""
          );

          setHasSettings(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchSettings();
    }
  }, [token]);

  async function handleSave(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!expectedNextPeriodDate) {
      setError("Please select your expected next period date.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/cycle/settings`,
        {
          method: hasSettings ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cycleLength,
            periodLength,
            expectedNextPeriodDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save your preferences."
        );
      }

      setHasSettings(true);

      if (firstTimeSetup) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setSuccess("Your cycle preferences have been saved successfully!");

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(event) {
  event.preventDefault();

  setPasswordMessage("");
  setPasswordError("");

  if (newPassword !== confirmPassword) {
    setPasswordError("New passwords do not match.");
    return;
  }

  if (newPassword.length < 8) {
    setPasswordError("New password must be at least 8 characters.");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/change-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to change password.");
    }

    setPasswordMessage(data.message);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (error) {
    setPasswordError(error.message);
  }
}

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-rose-950">
          Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your account and cycle preferences.
        </p>
      </div>

      {firstTimeSetup && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-rose-950 mb-2">
            Welcome to Down There! ❤️
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Before we take you to your dashboard, let's set up your
            menstrual cycle preferences. This information helps us
            personalize your calendar and cycle predictions.
          </p>

          <p className="text-sm font-medium text-rose-700 mt-3">
            Complete your preferences below and click Save Preferences
            to continue.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-8 space-y-6"
      >

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center">
            <CalendarDays className="text-rose-600" />
          </div>

          <div>
            <h2 className="font-semibold text-lg text-rose-950">
              Cycle Preferences
            </h2>

            <p className="text-sm text-gray-500">
              Adjust your average cycle information.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">
            Loading your saved preferences...
          </p>
        ) : (
          <>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average cycle length
              </label>

              <div className="relative">
                <select
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300 appearance-none bg-white"
                >
                  {[28, 29, 30, 31, 32].map((day) => (
                    <option key={day} value={day}>
                      {day} days
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaChevronDown size={12} />
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Count from the first day of one period to the first day of the next.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average period length
              </label>

              <div className="relative">
                <select
                  value={periodLength}
                  onChange={(e) => setPeriodLength(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300 appearance-none bg-white"
                >
                  {[4, 5, 6, 7].map((day) => (
                    <option key={day} value={day}>
                      {day} days
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaChevronDown size={12} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected next period date
              </label>

              <input
                type="date"
                value={expectedNextPeriodDate}
                onChange={(e) => setExpectedNextPeriodDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300"
                required
              />

              <p className="text-xs text-gray-400 mt-2">
                This is an estimate. You can update it as your cycle changes.
              </p>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Preferences"}
            </button>

          </>
        )}
      </form>

      <section className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-8 space-y-5">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
            <User className="text-purple-600" />
          </div>

          <div>
            <h2 className="font-semibold text-lg text-rose-950">
              Account Information
            </h2>

            <p className="text-sm text-gray-500">
              Your personal account details.
            </p>
          </div>
        </div>

       <div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      Username
    </label>

    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700">
      {user?.username || "Not available"}
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      Email Address
    </label>

    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700">
      {user?.email || "Not available"}
    </div>
  </div>
</div>

      </section>

      <section className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-8 space-y-5">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
            <Lock className="text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-lg text-rose-950">
              Security
            </h2>

            <p className="text-sm text-gray-500">
              Keep your account secure.
            </p>
          </div>
        </div>

       <form onSubmit={handlePasswordChange} className="space-y-5">

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      Current Password
    </label>

    <input
      type="password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      placeholder="Enter current password"
      required
      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-400"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      New Password
    </label>

    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder="Enter new password"
      required
      minLength={8}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-400"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      Confirm New Password
    </label>

    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirm new password"
      required
      minLength={8}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-400"
    />
  </div>

  {passwordError && (
    <p className="text-sm text-red-500">{passwordError}</p>
  )}

  {passwordMessage && (
    <p className="text-sm text-green-600">{passwordMessage}</p>
  )}

  <button
    type="submit"
    className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-3 rounded-xl transition"
  >
    Change Password
  </button>

</form>

      </section>

    </div>
  );
}
