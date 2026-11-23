import { Users, Plane, House, Mail, Lock } from 'lucide-react'
import InputField from '../../../components/ui/InputField'
import { Link, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { login } from '../authSlice'
import { useState } from 'react'
import Button from '../../../components/ui/Button'

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { status, error } = useAppSelector((s) => s.auth)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const result = await dispatch(login({ email, password }))
        if (login.fulfilled.match(result)) navigate("/")
    }

    return (
        <div className="min-h-dvh lg:flex">
            <div className="relative flex flex-col rounded-b-4xl bg-linear-to-br from-indigo-600 via-violet-600 via-60% to-purple-500 px-7 pt-12 pb-10 text-white lg:flex-7 lg:rounded-none lg:px-16 lg:py-8">
                <div className="mb-8 flex items-center gap-2 lg:mb-12">
                    <div className="rounded-xl bg-[#7769EB] p-2">
                        <Users size={20} />
                    </div>
                    <h4 className="text-2xl font-bold tracking-tight">SplitUp</h4>
                </div>
                <div>
                    <h2 className="mb-3 text-3xl font-bold tracking-tight lg:mb-4 lg:text-5xl">
                        Share expenses.<br />Stay Friends.
                    </h2>
                    <p className="text-sm opacity-90 lg:text-base">
                        Track who paid, split fairly and settle up with the <br className="hidden lg:block" />
                        fewest payments.
                    </p>
                </div>
                <div className="hidden flex-1 flex-col justify-end lg:flex">
                    <div className="relative top-4 ml-auto w-[220px] rounded-3xl bg-[#A56CF4] p-4">
                        <p>Settled this month</p>
                        <h3 className="text-2xl font-bold tracking-tight">$1,240</h3>
                    </div>
                    <div className="w-[300px] rounded-3xl bg-white px-4 py-2 text-black">
                        <div className="flex items-center justify-between gap-4 border-b border-[#EDEFF6] py-2">
                            <div className="rounded-lg bg-[#E6FBF3] p-2">
                                <Plane size={16} color="#0CB87F" />
                            </div>
                            <div className="flex-1">
                                <p>Trip to Gothenburg</p>
                                <p className="text-sm text-slate-500">4 members</p>
                            </div>
                            <h5 className="font-bold text-[#0CB87F]">+85</h5>
                        </div>
                        <div className="flex items-center justify-between gap-4 py-2">
                            <div className="rounded-lg bg-[#FFE9EE] p-2">
                                <House size={16} color="#F43F5E" />
                            </div>
                            <div className="flex-1">
                                <p>Flat 12</p>
                                <p className="text-sm text-slate-500">3 members</p>
                            </div>
                            <h5 className="font-bold text-[#F43F5E]">-40</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center px-7 py-10 lg:flex-6 lg:py-0">
                <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-4">
                    <div>
                        <h2 className="text-2xl font-bold lg:text-3xl">Welcome back</h2>
                        <p className="text-sm text-slate-500">Log in to see who owes what</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <InputField label="Email" placeholder="you@example.com" icon={Mail}
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputField label="Password" isPasswordField={true} placeholder="••••••••" icon={Lock}
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="text-sm text-rose-500">{error}</p>}
                    <Button type="submit" disabled={status === "loading"}>
                        {status === "loading" ? "Logging in..." : "Log in"}
                    </Button>
                </form>
                <div className="mx-auto mt-4 flex w-full max-w-md justify-center gap-2 text-sm">
                    <p>New here?</p>
                    <Link to="/register" className="font-bold text-[#6063F0]">Create an account</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage