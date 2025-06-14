import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // состояние успеха
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ email, password });
      setSuccess(true); // показываем сообщение об успехе
      setTimeout(() => {
        navigate("/login"); // через 2 секунды редирект на главную
      }, 1000);
    } catch (err) {
      if (err?.response?.status === 422) {
        const errorMessage = err.response.data.detail[0].msg;
        setError(errorMessage);
      } else if (err?.response?.status === 409) {
        const errorMessage = err.response.data.detail;
        setError(errorMessage);
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2>Registration</h2>
          </div>

          {error && (
            <div className="alert-danger">
              <strong>Error!</strong> {error}
            </div>
          )}

          {success && (
            <div className="alert-success">
              Register successful! Now you will be redirect...
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
                required
                disabled={success}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                disabled={success}
              />
            </div>

            <button type="submit" className="btn-register w-100" disabled={success}>
              Register
            </button>
          </form>

          <div className="register-footer">
            Already have an account?{" "}
            <Link to="/login" className="link-login">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}