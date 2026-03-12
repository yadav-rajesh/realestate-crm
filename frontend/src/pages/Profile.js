import { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setLoading(true);
    setProfileError("");
    API.get("/api/users/me")
      .then((res) => {
        const data = res.data || null;
        setProfile(data);
        setFullName(data?.fullName || "");
        setPhone(data?.phone || "");
        setEmail(data?.email || "");
      })
      .catch(() => {
        setProfileError("Failed to load profile.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const saveProfile = () => {
    if (!/^[0-9]{10}$/.test(phone)) {
      setProfileError("Phone number must be exactly 10 digits.");
      return;
    }

    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    API.put("/api/users/me", {
      fullName,
      phone,
      email,
    })
      .then((res) => {
        setProfile(res.data || null);
        setProfileSuccess("Profile updated successfully.");
      })
      .catch((err) => {
        setProfileError(err?.response?.data?.message || "Failed to update profile.");
      })
      .finally(() => {
        setSavingProfile(false);
      });
  };

  const changePassword = () => {
    const role = (profile?.role || "").toUpperCase();
    if (role === "AGENT" || role === "OWNER") {
      setPasswordError("Password is fixed to your registered mobile number.");
      return;
    }

    setSavingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    API.post("/api/users/change-password", {
      currentPassword,
      newPassword,
    })
      .then(() => {
        setPasswordSuccess("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
      })
      .catch((err) => {
        setPasswordError(err?.response?.data?.message || "Failed to update password.");
      })
      .finally(() => {
        setSavingPassword(false);
      });
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (profileError && !profile) {
    return <div className="p-6 text-red-600">{profileError}</div>;
  }

  const role = (profile?.role || "").toUpperCase();
  const passwordLocked = role === "AGENT" || role === "OWNER";

  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        {profileError && <p className="text-red-600 mb-2">{profileError}</p>}
        {profileSuccess && <p className="text-green-600 mb-2">{profileSuccess}</p>}

        <input
          className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
        />

        <input
          className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700 mb-4">
          <p>
            <span className="text-slate-500">Username:</span>{" "}
            <span className="font-semibold">{profile?.username || "-"}</span>
          </p>
          <p>
            <span className="text-slate-500">Role:</span>{" "}
            <span className="font-semibold">{profile?.role || "-"}</span>
          </p>
        </div>

        <button
          onClick={saveProfile}
          disabled={savingProfile || !fullName || !phone || !email}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {savingProfile ? "Saving..." : "Save Profile"}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>
        {passwordError && <p className="text-red-600 mb-2">{passwordError}</p>}
        {passwordSuccess && <p className="text-green-600 mb-2">{passwordSuccess}</p>}

        {passwordLocked ? (
          <p className="text-slate-600">
            Password for this account is your registered 10-digit mobile number.
          </p>
        ) : (
          <>
            <input
              type="password"
              className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={changePassword}
              disabled={savingPassword || !currentPassword || !newPassword}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
