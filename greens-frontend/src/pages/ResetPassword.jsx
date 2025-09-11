import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img1 from '../assets/img1.png';
import Header from '../components/Header';
import api from '../services/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const location = useLocation();
  const navigate = useNavigate();

  // Pobierz token i email z URL
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');
  const email = urlParams.get('email');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Sprawdź czy token i email są obecne
    if (!token || !email) {
      setError('Nieprawidłowy link resetowania hasła');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError('Hasła nie są identyczne');
      return;
    }

    if (password.length < 8) {
      setError('Hasło musi mieć co najmniej 8 znaków');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });

      setMessage('Hasło zostało pomyślnie zresetowane');
      setPassword('');
      setPasswordConfirmation('');

      // Przekieruj na stronę logowania po 3 sekundach
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid black',
    borderRadius: '0',
    fontSize: '1rem',
    backgroundColor: 'white',
    boxSizing: 'border-box',
    boxShadow: '5px 5px rgba(249, 115, 22, 1)',
    marginBottom: '1rem'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#45964d',
      fontFamily: 'Poppins, sans-serif',
      color: 'white'
    }}>

      <Header />

      {/* Main Content */}
      <main style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '2rem',
        alignItems: 'center',
        width: '100%',
        padding: isMobile ? '0 1.5rem 2rem' : '0 4rem 2rem',
        boxSizing: 'border-box',
        marginTop: isMobile ? '1rem' : '4rem'
      }}>

        {/* Form Section */}
        <div style={{
          width: isMobile ? '100%' : '60%',
          maxWidth: '500px',
          flexShrink: 0
        }}>
          {/* Breadcrumb */}
          <div style={{
            marginBottom: '2rem',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Home / Logowanie / Resetuj hasło
          </div>

          <h1 style={{
            fontWeight: '600',
            marginBottom: '1rem',
            fontSize: isMobile ? '2rem' : '2.5rem',
            lineHeight: 1.3
          }}>
            <span style={{
              boxShadow: 'inset 0 -0.4em 0 0 #f97316'
            }}>
              Resetuj hasło
            </span>
          </h1>

          <p style={{
            fontSize: '0.9rem',
            marginBottom: '2rem',
            lineHeight: 1.5,
            opacity: 0.9
          }}>
            Wprowadź nowe hasło dla swojego konta.
          </p>

          {message && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {message}
              <br />
              <small>Przekierowanie na stronę logowania za 3 sekundy...</small>
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {!error && token && email && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nowe hasło"
                  style={inputStyles}
                  required
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <input
                  type="password"
                  name="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Potwierdź nowe hasło"
                  style={inputStyles}
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !password || !passwordConfirmation}
                  style={{
                    backgroundColor: '#f97316',
                    color: 'white',
                    padding: '0.8rem 2rem',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    width: isMobile ? '100%' : 'auto',
                    opacity: loading || !password || !passwordConfirmation ? 0.6 : 1
                  }}
                >
                  {loading ? 'Resetowanie...' : 'Resetuj hasło'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Image Section */}
        <div style={{
          width: isMobile ? '80%' : '40%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: isMobile ? '3rem' : '0'
        }}>
          <img
            src={img1}
            alt="Illustration of a person on a ladder"
            style={{
              maxWidth: '100%',
              maxHeight: '65vh',
              objectFit: 'contain'
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
