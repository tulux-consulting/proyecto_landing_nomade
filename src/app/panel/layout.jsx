'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { panelIsAuthed, clearPanelSession } from '../../lib/auth.js';
import { BO } from '../../lib/store.js';
import { useStore, showToast, ToastHost } from '../../components/panel/ui.jsx';
import { Sidebar, MobileTop } from '../../components/panel/Shell.jsx';

export default function PanelLayout({ children }) {
  useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription = null;
    
    const initAuth = async () => {
      try {
        const { createClient } = await import('../../lib/supabase/client.js');
        const supabase = createClient();
        
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (pathname === '/panel/login') {
            if (session) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              if (profile?.role === 'admin') {
                router.replace('/panel');
              }
            }
            setLoading(false);
            return;
          }

          if (!session) {
            setAuthed(false);
            router.replace('/panel/login');
            setLoading(false);
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (!profile || profile.role !== 'admin') {
            setAuthed(false);
            router.replace('/unauthorized');
          } else {
            setAuthed(true);
          }
          setLoading(false);
        });

        subscription = data.subscription;
      } catch (e) {
        console.error('Error inicializando auth listener:', e);
        if (pathname !== '/panel/login') {
          router.replace('/panel/login');
        }
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router, pathname]);


  // Si está cargando o no está autenticado (y no es login), no renderizar nada
  if (loading) {
    return <div className="app-loading">Cargando panel...</div>;
  }

  if (pathname === '/panel/login') {
    return <>{children}</>;
  }

  if (!authed) {
    return null;
  }

  const user = BO.currentUser();
  const go = (r) => {
    router.push(r);
    setNavOpen(false);
  };
  const closeNav = () => setNavOpen(false);
  const onLogout = () => {
    clearPanelSession();
    router.replace('/panel/login');
  };

  return (
    <div className={"app" + (navOpen ? " nav-open" : "")}>
      <div className="side-scrim" onClick={closeNav}></div>
      <Sidebar route={pathname} navOpen={navOpen} onNav={closeNav} user={user} onLogout={onLogout} />
      <div className="main">
        <MobileTop onBurger={() => setNavOpen(true)} />
        <main style={{ padding: '1.5rem', width: '100%', height: '100%' }}>
          {children}
        </main>
      </div>
      <ToastHost />
    </div>
  );
}
