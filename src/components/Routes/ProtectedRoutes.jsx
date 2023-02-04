import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
    const user = sessionStorage.getItem("userID");
    return user;
}
const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to="/login" />
};

export default ProtectedRoutes;