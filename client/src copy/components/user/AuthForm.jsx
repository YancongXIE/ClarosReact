import { useState } from "react";
import Login from "./login/Login";
import Register from "./register/Register";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

  // Function to toggle between login and register
  const toggleForm = () => {
    setIsLogin(!isLogin); // Switch between login and register
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          {/* If isLogin is true, show login form, else show register form */}
          {isLogin ? (
            <>
              <Login />
              <p className="mt-4">
                Don't have an account?{" "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={toggleForm}
                >
                  Register here
                </button>
              </p>
            </>
          ) : (
            <>
              <Register />
              <p className="mt-4">
                Already have an account?{" "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={toggleForm}
                >
                  Login here
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
