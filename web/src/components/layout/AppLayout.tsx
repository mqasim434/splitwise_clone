import { Outlet } from "react-router"
import Sidebar from "./SideBar"
import BottomNav from "./BottomNav"

const AppLayout = () => {
    return (
        <div className="flex min-h-dvh bg-[#f4f5fb]">
            <Sidebar />
            <main className="flex-1 pb-24 lg:pb-0">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    )
}

export default AppLayout