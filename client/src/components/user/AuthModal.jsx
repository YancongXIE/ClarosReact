import { useState } from "react";
import Login from "./login/Login";
import Register from "./register/Register";

const AuthModal = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

  const toggleForm = () => {
    // Switch between login and register
    setIsLogin(!isLogin);
  };

  return (
    <dialog id="auth_modal" className="modal">
      <div className="modal-box relative">
        {" "}
        {/* Set position relative here */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("auth_modal").close()}
        >
          ✕
        </button>
        {/* If isLogin is true, show login form, else show register form */}
        {isLogin ? (
          <Login toggle={toggleForm} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Register toggle={toggleForm} />
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AuthModal;
