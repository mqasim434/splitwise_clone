import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, Plus, Receipt, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchGroupDetails } from "../groupSlice";
import AddExpenseModal from "../../expenses/components/addExpenseModal";

type Tab = "expenses" | "balances" | "activity"

const tabs: { key: Tab; label: string }[] = [
    { key: "expenses", label: "Expenses" },
    { key: "balances", label: "Balances" },
    { key: "activity", label: "Activity" },
]

const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

const GroupDetailPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { currentGroup, currentExpenses, detailStatus, error } = useAppSelector((s) => s.groups);
    const [activeTab, setActiveTab] = useState<Tab>("expenses");
    const [isExpenseOpen, setIsExpenseOpen] = useState(false)

    useEffect(() => {
        if (id) dispatch(fetchGroupDetails(id))
    }, [id, dispatch])

    // Loading
    if (detailStatus === "loading") {
        return (
            <div className="flex justify-center py-24">
                <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
        )
    }

    // Error
    if (detailStatus === "failed") {
        return (
            <div className="mx-auto max-w-5xl p-5 lg:p-8">
                <div className="rounded-2xl bg-rose-50 p-6 text-rose-600">
                    <p className="font-semibold">Could not load this group</p>
                    <p className="mt-1 text-sm">{error}</p>
                    <Link to="/groups" className="mt-4 inline-block text-sm font-semibold underline">
                        Back to groups
                    </Link>
                </div>
            </div>
        )
    }

    if (!currentGroup) return null

    return (
        <div className="mx-auto max-w-5xl p-5 lg:p-8">
            {/* Back link */}
            <Link
                to="/groups"
                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ChevronLeft className="size-4" />
                Groups
            </Link>

            {/* Header card */}
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 p-3.5 text-white">
                        <Users className="size-6" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold tracking-tight lg:text-2xl">{currentGroup.name}</h1>
                        <div className="mt-2 flex -space-x-2">
                            {currentGroup.members.slice(0, 5).map((member) => (
                                <div
                                    key={member._id}
                                    title={member.name}
                                    className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white ring-2 ring-white"
                                >
                                    {getInitials(member.name)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsExpenseOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 sm:ml-auto"
                >
                    <Plus className="size-4" />
                    Add expense
                </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {/* Left: tabs + content */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex rounded-xl bg-slate-100 p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${activeTab === tab.key
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === "expenses" &&
                        (currentExpenses.length === 0 ? (
                            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                                <div className="mb-3 rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                                    <Receipt className="size-6" />
                                </div>
                                <h3 className="font-semibold">No expenses yet</h3>
                                <p className="mt-1 text-sm text-slate-500">Add the first expense to start splitting</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 rounded-2xl bg-white px-4 shadow-sm">
                                {currentExpenses.map((expense) => (
                                    <div key={expense._id} className="flex items-center gap-3 py-3.5">
                                        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                            <Receipt className="size-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold">{expense.description}</p>
                                            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                                <span className="truncate">{expense.paidBy?.name ?? "Someone"} paid</span>
                                                <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-600">
                                                    {expense.splitType}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatMoney(expense.amount)}</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(expense.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                    {activeTab !== "expenses" && (
                        <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                            Coming soon
                        </div>
                    )}
                </div>

                {/* Right: members */}
                <div className="h-fit rounded-2xl bg-white p-5 shadow-sm">
                    <h2 className="mb-3 font-semibold">
                        Members <span className="text-slate-400">({currentGroup.members.length})</span>
                    </h2>
                    <div className="flex flex-col gap-3">
                        {currentGroup.members.map((member) => (
                            <div key={member._id} className="flex items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                                    {getInitials(member.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">{member.name}</p>
                                    <p className="truncate text-xs text-slate-500">{member.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isExpenseOpen && (
                <AddExpenseModal
                    group={currentGroup}
                    isOpen={isExpenseOpen}
                    onClose={() => setIsExpenseOpen(false)}
                />
            )}
        </div>
    )
}

export default GroupDetailPage