export default function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        active: 'bg-emerald-100 text-emerald-800',
        inactive: 'bg-gray-100 text-gray-700',
        open: 'bg-emerald-100 text-emerald-800',
        closed: 'bg-gray-100 text-gray-700',
        unpaid: 'bg-amber-100 text-amber-800',
        partial: 'bg-sky-100 text-sky-800',
        paid: 'bg-emerald-100 text-emerald-800',
        overdue: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-700',
    };

    return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}
