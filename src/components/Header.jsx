import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

export default function Header() {
  const { userData, logout } = useAuth();
  const { notifications, markAsRead, clearNotifications } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const authLinks = [
    { to: '/profile', label: 'Profile' },
    { to: '/friends', label: 'Friends' },
    { to: '/users', label: 'Users' },
    { to: '/news', label: 'News' },
    { to: '/news/create-news', label: 'Create News' },
  ];

  const guestLinks = [
    { to: '/login', label: 'Sign in' },
    { to: '/registration', label: 'Registration' },
  ];

  const notifDropdown = () => {
    setNotificationsDropdownOpen(!notificationsDropdownOpen);
    console.log('Колокольчик нажали, текущее состояние:', notificationsDropdownOpen);
  };

  const onNotificationClick = (id) => {
    markAsRead(id);
    setNotificationsDropdownOpen(false);
    navigate("/friends?tab=requests");
  };

  const onClearAll = () => {
    clearNotifications();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav
      className="navbar navbar-expand-lg py-1 position-relative"
      style={{
        background:
          'linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)',
      }}
    >
      <div className="container-fluid position-relative d-flex align-items-center">
        {/* Логотип */}
        <Link className="navbar-brand text-white fs-3 fw-bold fst-italic" to="/" onClick={() => setMenuOpen(false)}>
          Friendly
        </Link>

        {/* Бургер-меню */}
        <button
          className={`navbar-toggler border-0 d-lg-none ${menuOpen ? 'open' : ''}`}
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="bar top-bar"></span>
          <span className="bar middle-bar"></span>
          <span className="bar bottom-bar"></span>
        </button>

        {/* Меню для десктопа и мобильное меню */}
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          {/* Десктоп навигация */}
          <div className="center-nav d-none d-lg-flex ms-auto me-auto">
            {authLinks.map((item) => (
              <Link key={item.to} to={item.to} className="nav-link-custom mx-2">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="right-nav d-none d-lg-flex">
            {userData ? (
              <Link to="/login" onClick={handleLogout} className="nav-link-custom">
                Logout
              </Link>
            ) : (
              guestLinks.map((item) => (
                <Link key={item.to} to={item.to} className="nav-link-custom mx-2">
                  {item.label}
                </Link>
              ))
            )}
          </div>

          {/* Мобильное меню */}
          <ul className="navbar-nav d-lg-none w-100 mt-3">
            {userData ? (
              <>
                {authLinks.map((item) => (
                  <li key={item.to} className="nav-item">
                    <Link to={item.to} className="nav-link-custom" onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="nav-item">
                  <Link to="/login" onClick={handleLogout} className="nav-link-custom">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              guestLinks.map((item) => (
                <li key={item.to} className="nav-item">
                  <Link to={item.to} className="nav-link-custom" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}