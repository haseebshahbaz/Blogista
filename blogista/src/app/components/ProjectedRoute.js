'use client'; // Add this directive at the top

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firbase/firbase.js';

const ProjectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setLoading(false);
        router.push('/login'); // Redirect to login if no user
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{user ? 'Welcome!' : 'Please log in'}</div>;
};

export default ProjectedRoute;
