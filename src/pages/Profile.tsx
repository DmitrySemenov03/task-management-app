import { useState, useRef } from "react";
import { useAuth } from "./auth/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/Profile.module.css";
import defaultAvatar from "../assets/defaultUser.png";

function Profile() {
  const { user, photoURL, setPhotoURL: setGlobalPhoto } = useAuth();
  const [localPhoto, setLocalPhoto] = useState<string>(
    photoURL || defaultAvatar
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className={styles.container}>
        Please log in to view your profile.
      </div>
    );
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          { photoURL: base64, email: user.email },
          { merge: true }
        );
        setLocalPhoto(base64);
        setGlobalPhoto(base64);
      } catch (error) {
        console.error("Error saving photo:", error);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { photoURL: null }, { merge: true });
      setLocalPhoto(defaultAvatar);
      setGlobalPhoto(defaultAvatar);
    } catch (error) {
      console.error("Error removing photo:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h2 className={styles.name}>
            {user.displayName || "Anonymous User"}
          </h2>
          <p className={styles.email}>{user.email}</p>

          <div className={styles.infoSection}>
            <h3>Account Info</h3>
            <ul>
              <li>
                <strong>User ID:</strong> {user.uid}
              </li>
              <li>
                <strong>Email Verified:</strong>{" "}
                {user.emailVerified ? "Yes" : "No"}
              </li>
              <li>
                <strong>Provider:</strong> {user.providerData[0]?.providerId}
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.avatarWrapper}>
            <img
              src={localPhoto || defaultAvatar}
              alt="User avatar"
              className={styles.avatar}
            />
            {localPhoto !== defaultAvatar && (
              <button
                className={styles.removePhotoBtn}
                onClick={handleRemovePhoto}
                title="Remove photo"
              >
                ✕
              </button>
            )}
          </div>

          <button
            className={styles.uploadBtn}
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Change Photo"}
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
