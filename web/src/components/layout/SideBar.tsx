import { NavLink, useNavigate } from "react-router";
import { Users, LogOut } from "lucide-react";
import { navItems } from "./navItems";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")

const Sidebar = () => {
    const user = useAppSelector((s) => s.auth.user)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login", { replace: true })
    }

    return (
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
            <div className="mb-8 flex items-center gap-2.5 px-2">
                <div className="rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 p-2 text-white">
                    <Users size={18} />
                </div>
                <h4 className="text-xl font-bold tracking-tight">SplitUp</h4>
            </div>

            <nav className="flex flex-col gap-1">
                {navItems.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                isActive
                                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`
                        }
                    >
                        <Icon className="size-5" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                    {getInitials(user?.name)}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{user?.name}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Log out"
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-rose-500"
                >
                    <LogOut className="size-4" />
                </button>
            </div>
        </aside>
    )
}

export default Sidebar