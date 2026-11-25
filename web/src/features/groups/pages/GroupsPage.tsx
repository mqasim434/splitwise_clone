import { useEffect, useState } from "react"
import { Plus, Users, X, ChevronRight } from "lucide-react"
import Button from "../../../components/ui/Button"
import InputField from "../../../components/ui/InputField"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { createGroup, fetchGroups } from "../groupSlice"
import { Link } from "react-router"

const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")

const GroupsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [groupName, setGroupName] = useState("")

    const dispatch = useAppDispatch()
    const { groups, status, error, createStatus } = useAppSelector((s) => s.groups)
    const isCreating = createStatus === "loading"

    useEffect(() => {
        dispatch(fetchGroups())
    }, [dispatch])

    const openModal = () => setIsModalOpen(true)

    const closeModal = () => {
        setIsModalOpen(false)
        setGroupName("")
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!groupName.trim()) return
        const result = await dispatch(createGroup({ name: groupName.trim() }))
        if (createGroup.fulfilled.match(result)) closeModal()
    }

    return (
        <div className="mx-auto max-w-5xl p-5 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Groups</h1>
                    <p className="text-sm text-slate-500">Split expenses with the people you share them with</p>
                </div>
                <button
                    type="button"
                    onClick={openModal}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
                >
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">New group</span>
                </button>
            </div>

            {/* Groups list: loading, error, empty, list */}
            {status === "loading" && groups.length === 0 ? (
                <div className="flex justify-center py-16">
                    <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                </div>
            ) : error && !isModalOpen ? (
                <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
                    {error}
                    <button type="button" onClick={() => dispatch(fetchGroups())} className="ml-2 font-semibold underline">
                        Try again
                    </button>
                </div>
            ) : groups.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mb-4 rounded-2xl bg-indigo-50 p-4 text-indigo-600">
                        <Users className="size-7" />
                    </div>
                    <h3 className="font-semibold">No groups yet</h3>
                    <p className="mt-1 mb-5 text-sm text-slate-500">Create a group to start splitting expenses</p>
                    <Button className="w-fit" onClick={openModal}>Create your first group</Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groups.map((group) => (
                        <Link to={`/groups/${group._id}`}
                            key={group._id}
                            className="group flex cursor-pointer flex-col rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 p-2.5 text-white">
                                    <Users className="size-5" />
                                </div>
                                <ChevronRight className="size-5 text-slate-300 transition group-hover:text-indigo-500" />
                            </div>
                            <h3 className="font-semibold">{group.name}</h3>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {group.members.slice(0, 4).map((member) => (
                                        <div
                                            key={member._id}
                                            title={member.name}
                                            className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-[11px] font-bold text-white ring-2 ring-white"
                                        >
                                            {getInitials(member.name)}
                                        </div>
                                    ))}
                                    {group.members.length > 4 && (
                                        <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 ring-2 ring-white">
                                            +{group.members.length - 4}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm text-slate-500">
                                    {group.members.length} {group.members.length === 1 ? "member" : "members"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create group modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm lg:items-center"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl lg:rounded-3xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Create a group</h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Close"
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <InputField
                                label="Group name"
                                value={groupName}
                                placeholder="e.g. Trip to Gothenburg"
                                icon={Users}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            {error && <p className="text-sm text-rose-500">{error}</p>}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    loading={isCreating}
                                    disabled={!groupName.trim()}
                                    className="flex-2"
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GroupsPage