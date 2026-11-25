import { useState } from "react"
import { X } from "lucide-react"
import type { Group } from "../../groups/types"
import type { SplitType } from "../types"
import Button from "../../../components/ui/Button"
import { useAppSelector } from "../../../app/hooks";
import type { ExpenseInput } from "../types";
import { createExpense } from "../../groups/groupSlice";
import { useAppDispatch } from "../../../app/hooks"

type AddExpenseModalProps = {
    group: Group
    isOpen: boolean
    onClose: () => void
}

const splitTabs: { key: SplitType; label: string }[] = [
    { key: "equal", label: "Equal" },
    { key: "exact", label: "Exact" },
    { key: "percentage", label: "Percent" },
]

const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")

const AddExpenseModal = ({ group, isOpen, onClose }: AddExpenseModalProps) => {
    const user = useAppSelector((s) => s.auth.user)
    const { expenseStatus, error } = useAppSelector((s) => s.groups)

    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [paidBy, setPaidBy] = useState(user?._id ?? group.members[0]?._id ?? "")
    const [splitType, setSplitType] = useState<SplitType>("equal")
    const [selected, setSelected] = useState<string[]>(group.members.map((m) => m._id))
    const [values, setValues] = useState<Record<string, string>>({});

    const dispatch = useAppDispatch();

    if (!isOpen) return null

    const total = Number(amount) || 0
    const sumOfValues = Object.values(values).reduce((sum, v) => sum + (Number(v) || 0), 0)

    // Live feedback only. The server does the real math.
    const remaining =
        splitType === "exact" ? total - sumOfValues
            : splitType === "percentage" ? 100 - sumOfValues
                : 0
    const isBalanced = Math.abs(remaining) < 0.005

    const toggleMember = (id: string) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

    const setValue = (id: string, value: string) => setValues((prev) => ({ ...prev, [id]: value }))

    const canSave =
        description.trim() !== "" &&
        total > 0 &&
        (splitType === "equal" ? selected.length > 0 : isBalanced)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const base = {
            description: description.trim(),
            amount: total,
            groupId: group._id,
            paidBy,
        };

        // Only members who got a value above 0
        const filled = Object.entries(values).filter(([, v]) => Number(v) > 0);

        let body: ExpenseInput;

        // TODO:
        // 1. Build the body from splitType:
        //    equal      -> participants: selected
        //    exact      -> splits: [{ user, amount }] for values > 0
        //    percentage -> splits: [{ user, percentage }] for values > 0

        switch (splitType) {
            case "equal":
                body = { ...base, splitType: "equal", participants: selected }
                break
                break;
            case "exact":
                body = {
                    ...base,
                    splitType: "exact",
                    splits: filled.map(([user, v]) => ({ user, amount: Number(v) })),
                }
                break;
            case "percentage":
                body = {
                    ...base,
                    splitType: "percentage",
                    splits: filled.map(([user, v]) => ({ user, percentage: Number(v) })),
                }
                break;
        }

        // 2. dispatch(createExpense({ ...body, groupId: group._id }))
        const result = await dispatch(createExpense(body))
        // 3. On createExpense.fulfilled: reset the fields and call onClose()
        if (createExpense.fulfilled.match(result)) {
            setDescription("")
            setAmount("")
            setValues({})
            setSplitType("equal")
            setSelected(group.members.map((m) => m._id))
            onClose()
        }

    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm lg:items-center"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl lg:rounded-3xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h2 className="text-lg font-bold">Add expense</h2>
                    <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                    {/* Amount */}
                    <div className="my-4 text-center">
                        <label htmlFor="amount" className="text-xs font-medium text-slate-500">Amount (USD)</label>
                        <div className="flex items-center justify-center text-4xl font-extrabold tracking-tight">
                            <span className="text-slate-300">$</span>
                            <input
                                id="amount"
                                type="number"
                                inputMode="decimal"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-48 bg-transparent text-center outline-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
                    <input
                        type="text"
                        placeholder="e.g. Dinner"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Paid by */}
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Paid by</label>
                    <select
                        value={paidBy}
                        onChange={(e) => setPaidBy(e.target.value)}
                        className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {group.members.map((m) => (
                            <option key={m._id} value={m._id}>
                                {m._id === user?._id ? `${m.name} (you)` : m.name}
                            </option>
                        ))}
                    </select>

                    {/* Split type */}
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Split</label>
                    <div className="mb-3 flex rounded-xl bg-slate-100 p-1">
                        {splitTabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => { setSplitType(tab.key); setValues({}) }}
                                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${splitType === tab.key ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Member rows */}
                    <div className="divide-y divide-slate-100">
                        {group.members.map((m) => {
                            const isSelected = selected.includes(m._id)
                            const equalShare = selected.length > 0 && isSelected ? total / selected.length : 0

                            return (
                                <div key={m._id} className="flex items-center gap-3 py-2.5">
                                    {splitType === "equal" && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleMember(m._id)}
                                            className="size-4 accent-indigo-600"
                                        />
                                    )}
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-[11px] font-bold text-white">
                                        {getInitials(m.name)}
                                    </div>
                                    <span className="min-w-0 flex-1 truncate text-sm">{m.name}</span>

                                    {splitType === "equal" ? (
                                        <span className={`text-sm font-semibold ${isSelected ? "text-slate-700" : "text-slate-300"}`}>
                                            ${equalShare.toFixed(2)}
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            {splitType === "exact" && <span className="text-sm text-slate-400">$</span>}
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                min="0"
                                                step="0.01"
                                                placeholder="0"
                                                value={values[m._id] ?? ""}
                                                onChange={(e) => setValue(m._id, e.target.value)}
                                                className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-right text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            {splitType === "percentage" && <span className="text-sm text-slate-400">%</span>}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
                    {splitType === "equal" ? (
                        <span className="text-xs text-slate-500">
                            {selected.length} of {group.members.length} people
                        </span>
                    ) : (
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${isBalanced ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            {splitType === "exact" ? `Remaining $${remaining.toFixed(2)}` : `Remaining ${remaining.toFixed(2)}%`}
                        </span>
                    )}
                    <Button type="submit" className="w-fit" loading={expenseStatus === "loading"} disabled={!canSave}>
                        Save expense
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddExpenseModal