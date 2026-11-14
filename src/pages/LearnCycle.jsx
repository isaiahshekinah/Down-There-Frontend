
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Droplets,
  Sprout,
  Flower2,
  Heart,
  BookOpen
} from "lucide-react";

export default function LearnCycle() {
  const phases = [
    {
      name: "Menstrual Phase",
      days: "Usually days 1–5",
      description:
        "This is when your period begins. The uterus sheds its lining, which leaves the body through the vagina as menstrual blood.",
      tip:
        "You may experience cramps, tiredness or changes in mood. Rest and comfort can help.",
      icon: Droplets,
      color: "bg-rose-100 text-rose-600"
    },
    {
      name: "Follicular Phase",
      days: "Begins on day 1 and continues until ovulation",
      description:
        "Your body prepares an egg for release. At the same time, the lining of the uterus begins to build up again.",
      tip:
        "Energy levels may improve during this phase, although experiences differ.",
      icon: Sprout,
      color: "bg-orange-100 text-orange-600"
    },
    {
      name: "Ovulation Phase",
      days: "Usually around the middle of the cycle",
      description:
        "An ovary releases an egg. The egg can be fertilised for a limited time after release.",
      tip:
        "Some people notice changes in cervical mucus or mild one-sided pelvic discomfort.",
      icon: Flower2,
      color: "bg-purple-100 text-purple-600"
    },
    {
      name: "Luteal Phase",
      days: "After ovulation until the next period",
      description:
        "The body prepares for a possible pregnancy. If pregnancy does not occur, hormone levels fall and another period begins.",
      tip:
        "Some people experience bloating, breast tenderness, mood changes or food cravings.",
      icon: Heart,
      color: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <div className="space-y-9">

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-base text-rose-700 hover:text-rose-900"
      >
        <ArrowLeft size={19} />
        Back to Dashboard
      </Link>

      <div>
        <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-5">
          <BookOpen size={28} className="text-rose-600" />
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-rose-950">
          Understand Your Cycle
        </h1>

        <p className="text-base lg:text-lg text-gray-500 mt-3 leading-7">
          Learn what happens in your body throughout your menstrual cycle.
        </p>
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950 mb-3">
          What is the menstrual cycle?
        </h2>

        <p className="text-base text-gray-600 leading-8">
          The menstrual cycle is a series of natural changes your body goes
          through to prepare for a possible pregnancy. Day 1 is the first
          day of your period. The cycle continues until the day before your
          next period begins.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-rose-950 mb-6">
          The four phases
        </h2>

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const Icon = phase.icon;

            return (
              <div
                key={phase.name}
                className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-start gap-5">

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${phase.color}`}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm text-gray-400 mb-2">
                      PHASE {index + 1}
                    </p>

                    <h3 className="text-lg font-semibold text-rose-950">
                      {phase.name}
                    </h3>

                    <p className="text-sm text-rose-600 mt-2">
                      {phase.days}
                    </p>

                    <p className="text-base text-gray-600 leading-8 mt-4">
                      {phase.description}
                    </p>

                    <div className="bg-rose-50 rounded-xl p-4 mt-5">
                      <p className="text-sm font-semibold text-rose-800 mb-2">
                        Body tip
                      </p>

                      <p className="text-sm text-gray-600 leading-7">
                        {phase.tip}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950 mb-3">
          Remember
        </h2>

        <p className="text-base text-gray-600 leading-8">
          Not everyone's cycle is the same. Cycle length and phase timing
          can vary. The dates shown by Down There are estimates and should
          not be used as a method of preventing pregnancy.
        </p>
      </div>

    </div>
  );
}
