'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { panelIsAuthed, clearPanelSession } from '../../lib/auth.js';
import { BO } from '../../lib/store.js';
import { useStore, showToast, ToastHost, Spinner } from '../../components/panel/ui.jsx';
import { Sidebar, MobileTop } from '../../components/panel/Shell.jsx';


export default function PanelLayout({ children }) {
  useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);


  useEffect(() => {
    let subscription = null;
    
    const initAuth = async () => {
      try {
        const { createClient } = await import('../../lib/supabase/client.js');
        const supabase = createClient();
        
        // 1. Obtener sesión inicial
        const { data: { session } } = await supabase.auth.getSession();
        
        const handleSession = async (currentSession) => {
          if (pathname === '/panel/login') {
            if (currentSession) {
              const isResetting = typeof window !== 'undefined' && localStorage.getItem('nomade_bo_resetting_password') === 'true';
              if (!isResetting) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('is_active')
                  .eq('id', currentSession.user.id)
                  .single();
                if (profile?.is_active) {
                  router.replace('/panel');
                }
              }
            }
            setLoading(false);
            return;
          }

          if (pathname === '/panel/reset-password') {
            setLoading(false);
            return;
          }

          if (!currentSession) {
            setAuthed(false);
            router.replace('/panel/login');
            setLoading(false);
            return;
          }

          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('is_active, full_name, role')
              .eq('id', currentSession.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile from database:', profileError);
            }

            if (!profile || !profile.is_active) {
              setAuthed(false);
              router.replace('/unauthorized?reason=inactive');
            } else {
              const isAdmin = profile.role === 'admin';

              // Centralized authorization guard: normal users cannot access Ajustes (/panel/ajustes)
              if (pathname.startsWith('/panel/ajustes') && !isAdmin) {
                setAuthed(false);
                router.replace('/unauthorized?reason=admin_required');
                setLoading(false);
                return;
              }

              const activeUser = {
                nombre: profile.full_name || currentSession.user.email.split('@')[0],
                email: currentSession.user.email,
                role: profile.role,
                permisos: isAdmin
                  ? ['dashboard', 'postulaciones', 'partners', 'huespedes', 'destinos', 'contenido', 'ajustes']
                  : ['dashboard', 'postulaciones', 'partners', 'huespedes', 'destinos', 'contenido'],
                rolNombre: isAdmin ? 'Administrador' : 'Usuario'
              };
              
              localStorage.setItem('nomade_bo_sessionUser', JSON.stringify(activeUser));
              setAuthed(true);
              setUser(activeUser);
              
              // Pre-cargar postulaciones, partners y huéspedes
              const { PostulacionesRepository, PartnersRepository, HuespedesRepository } = await import('../../repositories/index');
              await Promise.all([
                PostulacionesRepository.getAll().catch(console.error),
                PartnersRepository.getAll().catch(console.error),
                HuespedesRepository.getAll().catch(console.error)
              ]);
            }
          } catch (e) {
            console.error('Error verificando rol de administrador:', e);
            setAuthed(false);
            router.replace('/panel/login');
          } finally {
            setLoading(false);
          }
        };

        // Procesar la sesión actual de inmediato
        await handleSession(session);

        // 2. Escuchar cambios de autenticación posteriores
        const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (event === 'SIGNED_OUT') {
            setAuthed(false);
            setUser(null);
            localStorage.removeItem('nomade_bo_sessionUser');
            router.replace('/panel/login');
            setLoading(false);
          } else if (event === 'SIGNED_IN') {
            await handleSession(newSession);
          }
        });

        subscription = data.subscription;
      } catch (e) {
        console.error('Error inicializando autenticación:', e);
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
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
        <Spinner message="Cargando panel..." />
      </div>
    );
  }

  if (pathname === '/panel/login' || pathname === '/panel/reset-password') {
    return <>{children}</>;
  }

  if (!authed) {
    return null;
  }

  const activeUser = user || BO.currentUser();

  const go = (r) => {
    router.push(r);
    setNavOpen(false);
  };
  const closeNav = () => setNavOpen(false);
  const onLogout = () => {
    clearPanelSession();
    localStorage.removeItem('nomade_bo_sessionUser');
    router.replace('/panel/login');
  };

  return (
    <div className={"app" + (navOpen ? " nav-open" : "")}>
      <div className="side-scrim" onClick={closeNav}></div>
      <Sidebar route={pathname} navOpen={navOpen} onNav={closeNav} user={activeUser} onLogout={onLogout} />

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
