import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, updateUserPassword, updateUserAvatar } from "../../redux/userSlice";
import { toast } from "react-toastify";
import "../../styles/Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // ✅ Get user from Redux state

  // ✅ State for user input fields
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "/images/default-avatar.png");
  const [loading, setLoading] = useState(false); // ✅ For button loading states

  // ✅ Sync Redux user state with local state
  useEffect(() => {
    if (user?.avatar) {
      setPreview(user.avatar); // ✅ Update preview when user changes
    }
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // ✅ Handle Profile Update (Name)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("⚠️ Name cannot be empty!");

    try {
      setLoading(true);
      await dispatch(updateUserProfile({ name })).unwrap();
      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      toast.error(`❌ ${error.message || "Failed to update profile"}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("⚠️ Password must be at least 6 characters!");
    if (password !== confirmPassword) return toast.error("⚠️ Passwords do not match!");

    try {
      setLoading(true);
      await dispatch(updateUserPassword({ password })).unwrap();
      setPassword("");
      setConfirmPassword("");
      toast.success("✅ Password updated successfully!");
    } catch (error) {
      toast.error(`❌ ${error.message || "Failed to update password"}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Avatar Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file)); // ✅ Show preview
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return toast.error("⚠️ Please select an image!");
  
    const formData = new FormData();
    formData.append("avatar", avatar);
  
    try {
      setLoading(true);
      const result = await dispatch(updateUserAvatar(formData)).unwrap();
  
      console.log("✅ Avatar Upload Success:", result);
  
      if (result?.avatar) {
        dispatch(fetchUserProfile()); // ✅ Refetch updated profile
      }
  
      toast.success("✅ Avatar updated successfully!");
    } catch (error) {
      console.error("❌ Avatar Upload Error:", error);
      toast.error(error.message || "Failed to update avatar!");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="profile-container">
      <h2>👤 My Profile</h2>

      {/* ✅ Profile Image Upload */}
      <div className="profile-avatar">
        <img src={preview} alt="Profile Avatar" className="avatar-preview" />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        <button className="btn-upload" onClick={handleAvatarUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Avatar"}
        </button>
      </div>

      {/* ✅ Update Name */}
      <form className="profile-form" onSubmit={handleUpdateProfile}>
        <label>Full Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Name"}
        </button>
      </form>

      {/* ✅ Update Password */}
      <form className="profile-form" onSubmit={handleUpdatePassword}>
        <label>New Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
