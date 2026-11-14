
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  CalendarDays,
  Heart,
  Settings,
  BookOpen
} from "lucide-react";

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does Down There calculate my next period?",
      answer:
        "Down There uses the period start date and average cycle length you provide to estimate when your next period may begin. These predictions are estimates and may change as you record more cycle history."
    },
    {
      question: "How do I get more accurate predictions?",
      answer:
        "Record your period start dates consistently and keep your cycle settings updated. Predictions may become more useful as you build a history of your cycles, but they cannot guarantee exactly when your next period will arrive."
    },
    {
      question: "Can I use Down There to prevent pregnancy?",
      answer:
        "No. Down There is not a contraceptive method. Fertile-window and ovulation predictions are estimates and cannot reliably identify every day when pregnancy is possible. Use a reliable contraceptive method if you want to prevent pregnancy."
    },
    {
      question: "Why is my period prediction different from my actual period?",
      answer:
        "Your cycle can naturally vary from month to month. Stress, illness, hormonal changes and other factors may affect your cycle. Record your actual period dates so your cycle history stays updated."
    },
    {
      question: "How do I update my cycle information?",
      answer:
        "Visit the Settings page to review your cycle preferences and update the information available there. You can also use Period Tracking to record your period activity."
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Down There is designed to keep your cycle information associated with your account. Avoid sharing your password or login token with anyone. For sensitive information, always use a secure device and keep your account credentials private."
    },
    {
      question: "What should I do if I notice unusual symptoms?",
      answer:
        "Do not rely on the app to diagnose symptoms. Visit the When to See a Doctor section for general guidance and speak with a qualified healthcare professional about symptoms that concern you."
    }
  ];

  const resources = [
    {
      title: "Understand Your Cycle",
      description: "Learn about the four phases of your menstrual cycle.",
      icon: BookOpen,
      link: "/learn-cycle"
    },
    {
      title: "When to See a Doctor",
      description: "Learn when menstrual symptoms may need medical attention.",
      icon: Heart,
      link: "/doctor-guide"
    },
    {
      title: "Manage Your Settings",
      description: "Review your account and cycle preferences.",
      icon: Settings,
      link: "/settings"
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <MessageCircle size={28} className="text-rose-600" />
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-rose-950">
          Help & Support
        </h1>

        <p className="text-base lg:text-lg text-gray-500 mt-3 leading-7">
          Find answers to common questions and learn how to get the most
          out of Down There.
        </p>
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle size={27} className="text-rose-600" />

          <h2 className="text-xl font-semibold text-rose-950">
            How can we help?
          </h2>
        </div>

        <p className="text-base text-gray-600 leading-8">
          Whether you have questions about your cycle predictions,
          account settings or how the app works, explore the answers
          below to find the information you need.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-rose-950 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="bg-white border border-rose-100 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between gap-4 text-left p-5 sm:p-6 hover:bg-rose-50 transition"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-rose-950 leading-7">
                  {faq.question}
                </span>

                <ChevronDown
                  size={22}
                  className={`text-rose-600 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-5 sm:px-6 pb-6">
                  <div className="border-t border-rose-100 pt-4">
                    <p className="text-base text-gray-600 leading-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-rose-950 mb-6">
          Helpful Resources
        </h2>

        <div className="space-y-4">
          {resources.map((resource) => {
            const Icon = resource.icon;

            return (
              <Link
                key={resource.title}
                to={resource.link}
                className="flex items-center gap-5 bg-white border border-rose-100 rounded-2xl p-5 sm:p-6 hover:border-rose-300 hover:bg-rose-50 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <Icon size={24} className="text-rose-600" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-rose-950">
                    {resource.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-500 mt-2 leading-7">
                    {resource.description}
                  </p>
                </div>

                <ChevronDown
                  size={21}
                  className="-rotate-90 text-rose-400 shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck size={25} className="text-rose-600" />

          <h2 className="text-xl font-semibold text-rose-950">
            Your privacy matters
          </h2>
        </div>

        <p className="text-base text-gray-600 leading-8">
          Your cycle information is personal. Keep your login details
          private and always sign out when using a shared device.
        </p>
      </div>

      <div className="text-center py-4">
        <CalendarDays
          size={27}
          className="text-rose-400 mx-auto mb-3"
        />

        <p className="text-sm text-gray-500">
          Thank you for choosing Down There.
        </p>

        <p className="text-sm text-rose-600 mt-1">
          Understand your cycle. Take care of yourself.
        </p>
      </div>

    </div>
  );
}
