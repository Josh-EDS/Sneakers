import { useState } from "react";
import { Eye, EyeOff, Facebook, Twitter, Mail, Github } from "lucide-react";
import CryptoJS from "crypto-js";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = "http://localhost:1337/api/user-ids";
  const API_TOKEN =
    "958dab05804bdec2c3b535d313365a849cf623f0d0f43e22e64b9eaa5d0fb1583384ff43cd8ee0e759190cb0989687b509bdf941646adab38297655673d06e92181703dee84e530fa6b140c506ef36d3eabbce23dc20bfc3686782d046138284b347b2ba24e36f0c4b14db89f16eef9028346723d53c7b53178b7e9f4985b3e4";

  const socialIcons = [
    { icon: <Facebook size={20} />, color: "hover:text-blue-600" },
    { icon: <Twitter size={20} />, color: "hover:text-blue-400" },
    { icon: <Mail size={20} />, color: "hover:text-red-500" },
    { icon: <Github size={20} />, color: "hover:text-gray-800" },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();

    if (email && password) {
      const hashedCredentials = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

      const userData = {
        Email: email,
        credentials: hashedCredentials,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify({ data: userData }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("User registered:", result);
          alert("Registration successful!");
          window.location.href = '/login';
        } else {
          const error = await response.json();
          alert(`Error: ${error.error?.message || "Something went wrong"}`);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Failed to register. Please try again.");
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
    <h1 className="text-3xl font-semibold text-center mb-8 text-orange-500 hover:text-orange-600 transition-colors">
      Register
    </h1>

    <div className="text-center mb-6">
      <p className="text-gray-600 mb-4">Register with social accounts</p>
      <div className="flex justify-center space-x-5 mb-4">
        {socialIcons.map((social, index) => (
          <a
            key={index}
            href="#"
            className={`w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center transition-colors ${social.color}`}
          >
            {social.icon}
          </a>
        ))}
      </div>
      <div className="relative mb-6">
        <div className="border-t border-gray-300 absolute w-full"></div>
        <span className="bg-white px-4 text-gray-500 relative">OR</span>
      </div>
    </div>

    <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Register
          </button>
        </form>
    <div className="text-center mt-8">
      <p className="text-gray-600">Already have an account?</p>
      <a href="/login" className="text-orange-500 hover:text-orange-700 transition-colors">
        Login
      </a>
    </div>
  </div>
</div>
  );
};

export default Register;
