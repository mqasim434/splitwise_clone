import { NavLink } from "react-router"
import { navItems } from "./navItems"

const BottomNav = () => {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-md items-center justify-around px-2 pt-2 pb-2">
                {navItems.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            `flex w-16 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold transition ${
                                isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`rounded-xl px-4 py-1 transition ${isActive ? "bg-indigo-50" : ""}`}>
                                    <Icon className="size-5" />
                                </span>
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export default BottomNav