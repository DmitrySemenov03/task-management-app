import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

type AutnConextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  photoURL: string;
  setPhotoURL: (url: string) => void;
};

const defaultPhoto = "/assets/defaultUser.png";

const AuthContext = createContext<AutnConextType>({
  user: null,
  loading: true,
  logout: async () => {},
  photoURL: defaultPhoto,
  setPhotoURL: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState<string>(defaultPhoto);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setPhotoURL(data.photoURL || defaultPhoto);
        } else {
          setPhotoURL(defaultPhoto);
        }
      } else {
        setPhotoURL(defaultPhoto);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, loading, logout, photoURL, setPhotoURL }),
    [user, loading, photoURL]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
