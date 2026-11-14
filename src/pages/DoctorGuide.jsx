
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Stethoscope,
  AlertCircle,
  AlertTriangle,
  HeartPulse,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  Droplets,
  MessageCircle,
  ShieldCheck,
  Clock
} from "lucide-react";

export default function DoctorGuide() {

  const whatsappNumber = "2349039759971";

  const message = encodeURIComponent(
    "Hello, I use Down There and would like to speak with a healthcare professional about a menstrual health concern."
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  const warningSigns = [
    {
      title: "Very heavy periods",
      description:
        "You regularly need to change your pad or tampon every 1–2 hours, bleed for more than 7 days, or pass unusually large blood clots.",
      icon: Droplets
    },
    {
      title: "Severe period pain",
      description:
        "Your cramps are so painful that they interfere with your normal activities, work, school or sleep, or the pain is getting worse.",
      icon: HeartPulse
    },
    {
      title: "Unusual bleeding",
      description:
        "You experience bleeding between periods, after sex, or a significant change in your usual bleeding pattern.",
      icon: AlertCircle
    },
    {
      title: "Changes in your cycle",
      description:
        "Your periods suddenly become irregular, stop unexpectedly, or regularly occur much earlier or later than usual.",
      icon: CalendarDays
    }
  ];

  const appointmentTips = [
    "Write down the dates your periods started and ended.",
    "Record how heavy your bleeding was and how often you changed period products.",
    "Note any pain, cramps, dizziness, fatigue or other symptoms.",
    "List any medicines, supplements or contraception you use.",
    "Write down questions you want to ask the healthcare professional."
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
          <Stethoscope size={28} className="text-rose-600" />
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-rose-950">
          When to See a Doctor
        </h1>

        <p className="text-base lg:text-lg text-gray-500 mt-3 leading-7">
          Your menstrual health matters. Learn which symptoms deserve
          medical attention and when to seek help.
        </p>
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-rose-950 mb-3">
          Listen to your body
        </h2>

        <p className="text-base text-gray-600 leading-8">
          Period experiences differ from person to person. Some changes
          are normal, but symptoms that are severe, persistent or unusual
          for you should not be ignored. A healthcare professional can
          help you understand what is happening.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-rose-950 mb-6">
          When to book a medical appointment
        </h2>

        <div className="space-y-5">
          {warningSigns.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Icon size={24} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-rose-950">
                      {item.title}
                    </h3>

                    <p className="text-base text-gray-600 leading-8 mt-3">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={27} className="text-red-600" />

          <h2 className="text-xl font-bold text-red-800">
            When to seek urgent medical help
          </h2>
        </div>

        <p className="text-base text-gray-700 leading-8 mb-5">
          Do not wait for a routine appointment if you experience:
        </p>

        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <AlertCircle size={19} className="text-red-600 shrink-0 mt-1" />
            <span className="text-base text-gray-700 leading-7">
              Extremely heavy bleeding accompanied by dizziness, fainting,
              shortness of breath or chest pain.
            </span>
          </li>

          <li className="flex items-start gap-3">
            <AlertCircle size={19} className="text-red-600 shrink-0 mt-1" />
            <span className="text-base text-gray-700 leading-7">
              Severe or sudden pelvic or abdominal pain.
            </span>
          </li>

          <li className="flex items-start gap-3">
            <AlertCircle size={19} className="text-red-600 shrink-0 mt-1" />
            <span className="text-base text-gray-700 leading-7">
              A missed period followed by unusual bleeding and abdominal
              or pelvic pain, especially if pregnancy is possible.
            </span>
          </li>
        </ul>

        <div className="bg-white rounded-xl p-4 mt-6">
          <p className="text-sm text-red-800 font-semibold">
            Important
          </p>

          <p className="text-sm text-gray-700 leading-7 mt-2">
            Seek emergency medical care at the nearest appropriate
            hospital if these symptoms occur. Do not rely on an app
            prediction to decide whether you need urgent care.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-green-100 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle size={29} className="text-green-600" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-rose-950">
              Talk to a Healthcare Professional
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
              <p className="text-sm font-semibold text-green-700">
                WhatsApp support available 24/7
              </p>
            </div>
          </div>
        </div>

        <p className="text-base text-gray-600 leading-8 mb-6">
          Have a question about your period, symptoms or menstrual health?
          You can start a private conversation with our healthcare support
          contact from the comfort of your home.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-base py-4 px-6 rounded-xl transition"
        >
          <MessageCircle size={23} />
          Chat with Us on WhatsApp
        </a>

        <div className="bg-green-50 rounded-xl p-4 mt-5">
          <div className="flex items-start gap-3">
            <ShieldCheck size={21} className="text-green-700 shrink-0 mt-1" />

            <p className="text-sm text-gray-600 leading-7">
              Your conversation takes place on WhatsApp, an external
              service. Be mindful when sharing sensitive personal or
              medical information.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5 text-gray-400">
          <Clock size={16} />
          <p className="text-xs">
            Available anytime, day or night
          </p>
        </div>
      </div>

      <div className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <ClipboardList size={25} className="text-rose-600" />

          <h2 className="text-xl font-semibold text-rose-950">
            Preparing for your appointment
          </h2>
        </div>

        <p className="text-base text-gray-600 leading-8 mb-6">
          Keeping track of your symptoms can help your doctor understand
          your experience and decide whether further checks are needed.
        </p>

        <div className="space-y-5">
          {appointmentTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2
                size={21}
                className="text-rose-500 shrink-0 mt-1"
              />

              <p className="text-base text-gray-600 leading-7">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <HeartPulse size={25} className="text-rose-600" />

          <h2 className="text-xl font-semibold text-rose-950">
            Your health comes first
          </h2>
        </div>

        <p className="text-base text-gray-600 leading-8">
          You do not have to wait until symptoms become unbearable before
          asking for help. If something about your cycle concerns you,
          speaking with a qualified healthcare professional is a good
          place to start.
        </p>
      </div>

      <p className="text-sm text-gray-400 leading-7">
        This information is for educational purposes only. Down There
        does not diagnose medical conditions or replace professional
        medical advice. WhatsApp support does not replace emergency
        medical care.
      </p>

    </div>
  );
}
