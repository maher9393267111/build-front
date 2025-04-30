// components/guards/AdminGuard.jsx
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const ServiceProviderGuard = ({ children }) => {
    const router = useRouter();
    const role = useSelector((state) => state.auth.role);
    const token = useSelector((state) => state.auth.token);
    const verified = useSelector((state) => state.auth.verified);

    if (typeof window !== "undefined" && (!token || role !== "SERVICE_PROVIDER" || !verified)) {
        router.replace('/signin');
        return null;
    }

    return children;
};

export default ServiceProviderGuard;