import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      if (err?.response?.status === 422) {
        const errorMessage = err.response.data.detail[0].msg;
        setError(errorMessage);
      }

      if (err?.response?.status === 401) {
        const errorMessage = err.response.data.detail;
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Log in</h2>
          </div>

          {error && (
            <div className="alert-danger">
              <strong>Error!</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
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
              />
            </div>

            <button type="submit" className="btn-login w-100">
              Log in
            </button>
          </form>

          <div className="login-footer">
            New to Friendly?{' '}
            <Link to="/registration" className="link-register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}