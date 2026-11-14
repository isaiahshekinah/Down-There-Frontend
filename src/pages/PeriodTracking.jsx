
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  Clock,
  Pencil,
  X,
  Save
} from "lucide-react";

import { useAuth } from "../context/AuthContexts";
import { API_BASE_URL } from "../services/api";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function PeriodTracking() {
  const { token } = useAuth();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [periods, setPeriods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = getTodayDate();

  async function fetchPeriods() {
    try {
      const response = await fetch(`${API_BASE_URL}/periods`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load period history.");
      }

      setPeriods(data.periods || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchPeriods();
    }
  }, [token]);

  function resetForm() {
    setStartDate("");
    setEndDate("");
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!startDate) {
      setError("Please select your period start date.");
      return;
    }

    if (endDate && endDate < startDate) {
      setError("Period end date cannot be before the start date.");
      return;
    }

    if (startDate > today) {
      setError("You cannot record a period that has not started yet.");
      return;
    }

    if (endDate && endDate > today) {
      setError("Period end date cannot be in the future.");
      return;
    }

    try {
      setSaving(true);

      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/periods/${editingId}`
          : `${API_BASE_URL}/periods`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startDate,
            endDate: endDate || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save period."
        );
      }

      resetForm();

      setSuccess(
        isEditing
          ? "Period updated successfully!"
          : "Your period has been recorded successfully!"
      );

      await fetchPeriods();

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(period) {
    setEditingId(period.id);
    setStartDate(period.start_date);
    setEndDate(period.end_date || "");

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this period record?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/periods/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete period."
        );
      }

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Period record deleted successfully!");

      await fetchPeriods();

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] p-5 md:p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Period Tracking
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Record your actual period dates and keep track of your history.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-pink-50 p-3 text-pink-500">
                <CalendarDays size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  {editingId ? "Edit Period" : "Record Your Period"}
                </h2>

                <p className="text-xs text-gray-500">
                  {editingId
                    ? "Update your recorded period dates."
                    : "Enter your actual period dates."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Period Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  max={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Period End Date
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  max={today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 font-medium text-white transition hover:bg-rose-00 disabled:opacity-60"
              >
                {editingId ? <Save size={18} /> : <Plus size={18} />}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Period"
                    : "Save Period"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setError("");
                    setSuccess("");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <X size={18} />
                  Cancel Editing
                </button>
              )}

            </form>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-500">
                <Clock size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Period History
                </h2>

                <p className="text-xs text-gray-500">
                  Your previously recorded periods.
                </p>
              </div>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-gray-400">
                Loading your period history...
              </p>
            ) : periods.length === 0 ? (
              <div className="py-10 text-center">
                <CalendarDays
                  size={35}
                  className="mx-auto mb-3 text-gray-300"
                />

                <p className="text-sm text-gray-500">
                  No periods recorded yet.
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Your recorded periods will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {periods.map((period) => (
                  <div
                    key={period.id}
                    className="rounded-xl border border-gray-100 p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="font-medium text-gray-800">
                          {new Date(
                            `${period.start_date}T00:00:00`
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {period.end_date
                            ? `Ended ${new Date(
                                `${period.end_date}T00:00:00`
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}`
                            : "End date not recorded"}
                        </p>
                      </div>

                      <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                        Recorded
                      </span>

                    </div>

                    <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">

                      <button
                        type="button"
                        onClick={() => handleEdit(period)}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(period.id)}
                        className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
