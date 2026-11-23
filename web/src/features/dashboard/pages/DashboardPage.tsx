import Button from "../../../components/ui/Button";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router";
import { logout } from "../../auth/authSlice";

const DashboardPage = () => {
    const user = useAppSelector((s) => s.auth.user);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    }

    return (
        <div className="center flex flex-col justify-center items-center h-screen">
            <h2 className="font-bold text-4xl text-center mb-4">{user?.name}</h2>
            <Button onClick={handleLogout} style={{maxWidth: "max-content"}}>Logout</Button>
        </div>
    )
}

export default DashboardPage
