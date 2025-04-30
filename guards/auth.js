'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'src/redux';
import { useRouter } from 'next/navigation';

// components
export default function Guest({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector(({ user }) => user);
  const [isAuth, setAuth] = useState(true);
  useEffect(() => {
    if (!isAuthenticated) {
      setAuth(false);
      router.push('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!isAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return children;
}

Guest.propTypes = {
  children: PropTypes.node.isRequired
};
