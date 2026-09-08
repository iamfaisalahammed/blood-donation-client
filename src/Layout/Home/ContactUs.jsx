import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    emailjs
      .sendForm(
        "service_fp284b6",
        "template_6eok0mr",
        form.current,
        "tfhng-JnJ5_qnRMZy"
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          form.current.reset();
          setSending(false);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          toast.error("Failed to send message. Please try again.");
          setSending(false);
        }
      );
  };

  const contactInfo = [
    {
      icon: FaPhoneAlt,
      title: "Phone",
      value: "+8801820037321",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      value: "faisalahammed003@gmail.com",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Location",
      value: "Chittagong, Bangladesh",
    },
  ];

  return (
    <section className="bg-white px-5 py-20 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Get In Touch
          </p>

          <h1 className="font-serif text-4xl font-black italic leading-tight text-gray-950 sm:text-5xl md:text-6xl">
            Let's Start a
            <span className="text-red-600"> Conversation</span>
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-gray-200" />
            <span className="h-[3px] w-12 rounded-full bg-red-600" />
            <span className="h-[2px] w-8 bg-gray-200" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-7 text-gray-500 sm:text-base">
            Have a question, suggestion or want to collaborate? Send us a
            message and we will get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Content */}
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Contact Information */}
          <div className="relative overflow-hidden rounded-[28px] bg-gray-950 p-7 text-white sm:p-9 lg:col-span-2">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-600/10" />

            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                Contact Information
              </span>

              <h2 className="mt-4 font-serif text-3xl font-black italic leading-tight sm:text-4xl">
                We would love to
                <span className="block text-red-500">hear from you.</span>
              </h2>

              <p className="mt-5 text-sm font-medium leading-7 text-gray-400">
                Whether you need help, have feedback or want to work together,
                feel free to reach out.
              </p>

              <div className="mt-10 space-y-7">
                {contactInfo.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-red-500">
                        <Icon className="text-lg" />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          {item.title}
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-gray-200 sm:text-base">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-red-500" />

                  <p className="text-sm font-medium text-gray-400">
                    Your message is always welcome.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-[28px] border border-gray-100 bg-white p-7 shadow-[0_15px_50px_rgba(0,0,0,0.05)] sm:p-9 lg:col-span-3">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Send a Message
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                How can we help?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Fill out the form below and we will get back to you shortly.
              </p>
            </div>

            <form
              ref={form}
              onSubmit={sendEmail}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Name
                </label>

                <input
                  type="text"
                  name="from_name"
                  placeholder="Enter your name"
                  className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Email
                </label>

                <input
                  type="email"
                  name="from_email"
                  placeholder="Enter your email"
                  className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Message
                </label>

                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  rows="6"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-100 transition-all duration-300 hover:bg-red-700 hover:shadow-red-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="font-serif text-xl font-black italic text-gray-900 sm:text-2xl">
            Every message can start something meaningful.
          </p>

          <p className="mt-2 text-sm font-medium text-gray-400">
            Thank you for being part of our community.
          </p>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </section>
  );
};

export default ContactUs;