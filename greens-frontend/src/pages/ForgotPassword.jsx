import React, { useState, useEffect } from 'react';
import img1 from '../assets/img1.png';
import Header from '../components/Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      // TODO: Zastąp tym właściwym endpointem API
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Instrukcje resetowania hasła zostały wysłane na Twój adres e-mail.');
        setEmail('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Wystąpił błąd. Spróbuj ponownie.');
      }
    } catch (error) {
      setError('Wystąpił błąd połączenia. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const inputStyles = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid black',
    borderRadius: '0',
    fontSize: '1rem',
    backgroundColor: 'white',
    boxSizing: 'border-box',
    boxShadow: '5px 5px rgba(249, 115, 22, 1)'
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
            Home / Logowanie / Przypomnij hasło
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
              Przypomnij hasło
            </span>
          </h1>

          <p style={{
            fontSize: '0.9rem',
            marginBottom: '2rem',
            lineHeight: 1.5,
            opacity: 0.9
          }}>
            Podaj adres e-mail, na który dostaniesz wiadomość z przypomnieniem hasła.
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

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '2rem' }}>
              <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={handleChange} 
                placeholder="email.com" 
                style={inputStyles} 
                required 
              />
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  backgroundColor: '#f97316', 
                  color: 'white', 
                  padding: '0.8rem 2rem', 
                  border: 'none', 
                  borderRadius: '20px', 
                  fontSize: '1rem', 
                  fontWeight: '500', 
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij przypomnienie hasła'}
              </button>
            </div>
          </form>
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

export default ForgotPassword;