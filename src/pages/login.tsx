import { app, auth, provider } from "../firebaseClient";
import { signInWithPopup, signOut } from "firebase/auth";
import Cookies from "js-cookie";

const getCsrfToken = async () => {
  const res = await fetch("http://localhost:3000/csrf-token", {
    credentials: "include",
  });
    if (!res.ok) throw new Error("Failed to fetch CSRF token");

  const data = await res.json();
  return data.csrfToken;
};

export const googleLogin = async () => {
    try { 
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
        const csrfToken = await getCsrfToken();

        await fetch("http://localhost:3000/sessionLogin", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ idToken }),
        });
    } catch (err) {
        console.error("Login error: ", err);
    }
};

export const logOut = async () => {
    try {
        const csrfToken = await getCsrfToken();
        await fetch("http://localhost:3000/sessionLogout", {
            method: "POST",
            credentials: "include",
              headers: {
                "X-CSRF-Token": csrfToken,
            },
      });
      await signOut(auth);
      console.log('signed out forever');
    } catch (err) {
        console.error("Logout error: ", err);
    }
}
