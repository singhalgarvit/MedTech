import React, { useEffect, useState } from "react";
import { getMyPatientProfile, updateMyPatientProfile } from "../../services/patientService";

function PatientProfileUpdate() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "" });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMyPatientProfile()
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          setForm({ name: data.name ?? "" });
          if (data.img) setProfileImagePreview(data.img);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImageFile(null);
      setProfileImagePreview(profile?.img ?? null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const formData = new FormData();
      if (form.name.trim() !== "") formData.append("name", form.name.trim());
      if (profileImageFile) formData.append("img", profileImageFile);
      
      if (formData.get("name") || formData.get("img")) {
        const updated = await updateMyPatientProfile(formData);
        setSuccess("Profile updated successfully.");
        setProfileImageFile(null);
        setProfile(updated);
        setForm({ name: updated.name ?? "" });
        if (updated.img) setProfileImagePreview(updated.img);
      } else {
        setError("Change at least one field to update.");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-48 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Profile</h2>
      <p className="text-gray-600 mb-6">Edit your details. Changes are saved immediately.</p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile picture <span className="text-gray-400 font-normal">(optional — choose a file only to change)</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden border border-gray-300 flex items-center justify-center">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">?</span>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="block text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder={profile?.name ? undefined : "Your name"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default PatientProfileUpdate;
