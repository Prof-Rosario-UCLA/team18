import { useState, useEffect } from "react";
import { useTheme } from "@/context/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "./search"; 
import { googleLogin, logOut } from "@/pages/login";
import { auth } from "@/firebaseClient";
import { onAuthStateChanged, type User } from "firebase/auth";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const currUser = auth.currentUser;
  const [user, setUser] = useState<User | null>(null);

  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const registered = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => registered();
  },  []);

  // Handler to make spin animation
  const handleSpin = () => {
    setSpinning(true);
  };

  // Remove after animation end
  const handleAnimationEnd = () => {
    setSpinning(false);
  };

  return ( 
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"}>
          <img 
            src="/sun_logo.png" 
            alt="Weather Tracker Logo" 
            className={`h-30 ${spinning ? "spin" : ""}`} 
            onClick={handleSpin} 
            onAnimationEnd={handleAnimationEnd}
            style={{ cursor: "pointer" }}
          />
        </Link>

        <div className="flex gap-8">
              { !currUser ? (
                <div>
              <button onClick={googleLogin}>Register!</button> 
              </div>
              ) : ( 
                <div>
              <button onClick={logOut}>Logout!</button> 
              </div>
            )}
          {/* search */}
          <SearchBar/>
          {/* theme toggle */}
          <div 
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all"/>
            ) : (
              <Moon className="h-6 w-6 text-black-500 rotate-0 transition-all"/>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
