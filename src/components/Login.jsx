import { useState } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { LOGIN_VALIDATE_URL } from "../constants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function validateLogin(e) {
    e.preventDefault();
    setDisable(true);
    try {
      const response = await fetch(LOGIN_VALIDATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const json = await response.json();

      if (response.status === 200) {
        // console.log("Login Success");
        navigate("/dashboard", { state: { id: json.data.id } });
      } else if (response.status === 401) {
        setError(json.ui_err_msg);
      }
      setDisable(false);
    } catch (err) {
      console.log(err);
      // alert("Login Failed");
      setDisable(false);
    }
  }

  return (
    <div className="bg-[#030303] w-screen h-screen flex flex-col justify-center items-center text-white gap-4">
      <form
        onSubmit={validateLogin}
        className="flex flex-col gap-4 text-[16px]"
      >
        <h1 className=" text-[32px] w-[600px] text-center mb-8 font-bold">
          Venue Admin Login
        </h1>
        <input
          disabled={disable}
          className="bg-[#030303] border rounded-2xl p-3 focus:outline-none  placeholder:text-white"
          type="text"
          placeholder="Username"
          value={username}
          required={true}
          onChange={(e) => {
            setError(null);
            setUsername(e.target.value);
          }}
        />
        <div className="w-full relative">
          <input
            disabled={disable}
            className="bg-[#030303] border rounded-2xl p-3 w-full focus:outline-none placeholder:text-white"
            type={showPassword ? "text" : "password"}
            placeholder="Password "
            value={password}
            required={true}
            minLength={8}
            onChange={(e) => {
              setError(null);
              setPassword(e.target.value);
            }}
          />
          {showPassword && !disable ? (
            <IoEyeOffSharp
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              className=" absolute right-4 top-[10px] "
              size={30}
            />
          ) : (
            !disable && (
              <IoEyeSharp
                onClick={() => setShowPassword(!showPassword)}
                className=" absolute right-4 top-[10px] "
                size={30}
              />
            )
          )}
        </div>

        <button
          className="bg-[#6741D9] font-bold   hover:border-[#F0C3F1] rounded-2xl p-3 mt-8 border border-black ease-in-out duration-300  "
          disabled={disable}
        >
          Sign in
        </button>
      </form>
      <button className="">New Registration ?</button>
      <span className="text-red-600">{error}</span>
    </div>
  );
};

export default Login;
