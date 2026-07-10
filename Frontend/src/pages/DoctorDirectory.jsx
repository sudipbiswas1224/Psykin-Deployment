import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import {
  AlertCircle,
  ArrowRight,
  Clock3,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const nationalHelplines = [
  {
    name: "Tele-MANAS",
    number: "14416",
    description: "National tele-mental health helpline",
  },
  {
    name: "KIRAN",
    number: "1800-599-0019",
    description: "24x7 mental health support",
  },
  {
    name: "Emergency Services",
    number: "112",
    description: "Immediate emergency response",
  },
];

const DoctorDirectory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [location, setLocation] = useState(null);

  const normalizeDoctors = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.doctors)) return payload.doctors;
    return [];
  };

  const loadSavedDoctors = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/doctors/nearby");
      const payload = response.data;
      setSummary(payload?.summary || "Saved doctors list.");
      setDoctors(normalizeDoctors(payload?.data ?? payload));
    } catch (requestError) {
      console.error("Failed to fetch nearby doctors:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Unable to load nearby doctors right now.",
      );
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshDoctorsWithLocation = async (lat, lng) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/doctors/nearby", {
        lat,
        lng,
      });

      const payload = response.data;
      setSummary(payload?.summary || "Nearby doctors refreshed.");
      setDoctors(normalizeDoctors(payload?.data ?? payload));
      setLocation({ lat, lng });
    } catch (requestError) {
      console.error("Failed to refresh nearby doctors:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Unable to refresh doctors right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSavedDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseMyLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        refreshDoctorsWithLocation(lat, lng);
      },
      () => {
        setError(
          "Location access was denied. Please allow location permission and try again.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white shadow-sm md:p-10">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-36 w-36 -translate-x-10 translate-y-10 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
            <Stethoscope size={16} />
            Doctors Directory
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Find nearby mental health support with one click.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
            Allow location access to to get the nearby doctor's list
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleUseMyLocation}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 "
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Navigation size={18} />
              )}
              Use my current location
            </button>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-emerald-50 backdrop-blur">
              <ShieldAlert size={18} />
              Location is only used for this search
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <AlertCircle className="mt-0.5 shrink-0" size={20} />
          <p className="text-sm leading-6">{error}</p>
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Nearby doctors
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {summary || "Use your location to load local doctors."}
              </p>
            </div>

            {location ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <MapPin size={14} />
                  Current location
                </div>
                <div className="mt-1 font-mono">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex min-h-72 items-center justify-center rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3 text-slate-600">
                  <Loader2
                    className="animate-spin text-emerald-600"
                    size={22}
                  />
                  Finding doctors near you...
                </div>
              </div>
            ) : doctors.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {doctors.map((doctor, index) => (
                  <article
                    key={`${doctor.name || "doctor"}-${index}`}
                    className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {doctor.specialization || "Doctor"}
                        </div>
                        <h3 className="mt-3 text-lg font-bold text-slate-800">
                          {doctor.name || "Unnamed doctor"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {doctor.hospital?.name ||
                            doctor.location?.city ||
                            "Nearby clinic"}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-400 dark:bg-slate-400 dark:text-slate-600">
                          <span>{doctor.experience ?? 0} years experience</span>
                          <span className="text-slate-300">|</span>
                          <span className="inline-flex items-center gap-1 text-amber-700">
                            <span className="inline-flex items-center justify-center rounded-full bg-amber-50 p-1">
                              <Stethoscope
                                size={10}
                                className="text-amber-500"
                              />
                            </span>
                            {doctor.ratings?.averageRating ?? 0}/5 rating
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-2xl bg-white p-3 text-emerald-600 ring-1 ring-emerald-100">
                        <Stethoscope size={20} />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        {doctor.location?.address || "Address not available"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {doctor.phone ||
                          doctor.hospital?.phone ||
                          "Phone not listed"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 size={14} className="text-slate-400" />
                        Fee: {doctor.fees?.consultationFee ?? "N/A"}{" "}
                        {doctor.fees?.currency || "INR"}
                      </div>
                    </div>

                    {doctor.bio ? (
                      <p className="mt-4 text-sm leading-6 text-slate-500 line-clamp-4">
                        {doctor.bio}
                      </p>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-3">
                      {doctor.phone ? (
                        <a
                          href={`tel:${doctor.phone}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          Call now
                          <ArrowRight size={16} />
                        </a>
                      ) : null}
                      {doctor.email ? (
                        <a
                          href={`mailto:${doctor.email}`}
                          className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                        >
                          Email
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                <div className="rounded-2xl bg-white p-4 text-emerald-600 shadow-sm ring-1 ring-slate-100">
                  <Navigation size={24} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  No doctors loaded yet
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Click the location button above and allow access to see the
                  nearby doctor directory.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-slate-800">
              National helplines
            </h2>
            

            <div className="mt-5 space-y-3">
              {nationalHelplines.map((helpline) => (
                <a
                  key={helpline.name}
                  href={`tel:${helpline.number}`}
                  className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-emerald-200 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {helpline.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {helpline.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-700">
                        {helpline.number}
                      </div>
                      <div className="text-xs text-slate-400">Tap to call</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 p-6 text-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldAlert size={18} />
              Safety note
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              If someone is in immediate danger or needs urgent help, use local
              emergency services first. This directory is a support layer, not a
              replacement for emergency care.
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
};

export default DoctorDirectory;
