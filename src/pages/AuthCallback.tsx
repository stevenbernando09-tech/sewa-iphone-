import React, { useEffect } from 'react';

const AuthCallback = () => {
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash) {
        // Parse the token from anchor fragment
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const error = params.get('error');

        if (window.opener) {
          if (accessToken) {
            window.opener.postMessage(
              { type: 'OAUTH_AUTH_SUCCESS', token: accessToken },
              window.location.origin
            );
          } else if (error) {
            window.opener.postMessage(
              { type: 'OAUTH_AUTH_FAILURE', error: error },
              window.location.origin
            );
          }
          window.close();
        } else {
          // Fallback if opened directly
          window.location.href = '/slides';
        }
      } else {
        // If no hash parameter
        window.location.href = '/slides';
      }
    } catch (err) {
      console.error('Error handling oauth callback:', err);
      if (window.opener) {
        window.opener.postMessage(
          { type: 'OAUTH_AUTH_FAILURE', error: 'Callback handling exception' },
          window.location.origin
        );
        window.close();
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
      <div className="text-center p-8 border border-zinc-900 rounded-[2.5rem] bg-zinc-950 max-w-md shadow-2xl animate-pulse">
        <h1 className="text-2xl font-display font-black uppercase tracking-widest mb-4">Otentikasi...</h1>
        <p className="text-sm text-zinc-500 font-medium leading-relaxed">
          Sedang menghubungkan ke Google Slides secara aman. Jendela ini akan tertutup otomatis.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
