// components/guards/AdminGuard.jsx
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const AdminGuard = ({ children }) => {
    const router = useRouter();
    const role = useSelector((state) => state.auth.role);
    const token = useSelector((state) => state.auth.token);

    if (typeof window !== "undefined" && (!token || role !== "ADMIN")) {
        router.replace('/signin');
        return null;
    }

    return children;
};

export default AdminGuard;