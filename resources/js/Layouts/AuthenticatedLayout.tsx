import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react';

type NavItem = {
    label: string;
    href: string;
    active: boolean;
    icon: string;
};

type NavSection = {
    label: string;
    items: NavItem[];
};

function SidebarIcon({ name }: { name: string }) {
    const common = 'h-4 w-4';

    switch (name) {
        case 'dashboard':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 13h7V4H4v9Z" />
                    <path d="M13 20h7V4h-7v16Z" />
                    <path d="M4 20h7v-5H4v5Z" />
                </svg>
            );
        case 'customers':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            );
        case 'area':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                </svg>
            );
        case 'tariff':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7H4" />
                    <path d="M20 12H4" />
                    <path d="M20 17H4" />
                    <path d="M7 4v16" />
                </svg>
            );
        case 'period':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4" />
                    <path d="M8 2v4" />
                    <path d="M3 10h18" />
                </svg>
            );
        case 'bill':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 3h10l3 3v15l-3-2-3 2-3-2-3 2-3-2-3 2V6l5-3Z" />
                    <path d="M8 10h8" />
                    <path d="M8 14h6" />
                </svg>
            );
        case 'payment':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                    <path d="M6 15h4" />
                </svg>
            );
        case 'mobile':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="7" y="2" width="10" height="20" rx="2" />
                    <path d="M11 18h2" />
                </svg>
            );
        case 'report':
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19V5" />
                    <path d="M4 19h16" />
                    <path d="M8 16v-5" />
                    <path d="M12 16V8" />
                    <path d="M16 16v-3" />
                </svg>
            );
        default:
            return null;
    }
}

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${
                item.active
                    ? 'bg-gray-100 font-semibold text-gray-950'
                    : 'font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-950'
            }`}
        >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <SidebarIcon name={item.icon} />
            </span>
            <span className="truncate">{item.label}</span>
        </Link>
    );
}

function SidebarContent({
    sections,
    onNavigate,
    onOpenCommand,
}: {
    sections: NavSection[];
    onNavigate?: () => void;
    onOpenCommand: () => void;
}) {
    return (
        <>
            <div className="flex h-16 items-center gap-2 px-4">
                <Link href={route('dashboard')} onClick={onNavigate} className="flex min-w-0 items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900">
                        <ApplicationLogo className="block h-5 w-auto fill-current text-white" />
                    </div>
                    <span className="truncate text-base font-bold tracking-normal text-gray-950">PAM Billing</span>
                </Link>
            </div>

            <div className="px-3 py-3">
                <button
                    type="button"
                    onClick={onOpenCommand}
                    className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-sm text-gray-400 transition hover:border-gray-300 hover:bg-white hover:text-gray-700"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <span className="min-w-0 flex-1 truncate">Cari menu</span>
                    <span className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-400">Ctrl K</span>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-3">
                {sections.map((section) => (
                    <div key={section.label} className="mb-4">
                        <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{section.label}</p>
                        <div className="space-y-0.5">
                            {section.items.map((item) => (
                                <SidebarLink key={item.label} item={item} onNavigate={onNavigate} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </>
    );
}

function CommandPalette({
    open,
    sections,
    onClose,
}: {
    open: boolean;
    sections: NavSection[];
    onClose: () => void;
}) {
    const [query, setQuery] = useState('');
    const items = useMemo(
        () =>
            sections.flatMap((section) =>
                section.items.map((item) => ({
                    ...item,
                    section: section.label,
                })),
            ),
        [sections],
    );
    const filteredItems = useMemo(() => {
        const value = query.trim().toLowerCase();

        if (!value) {
            return items;
        }

        return items.filter((item) => `${item.label} ${item.section}`.toLowerCase().includes(value));
    }, [items, query]);

    useEffect(() => {
        if (open) {
            setQuery('');
        }
    }, [open]);

    if (!open) {
        return null;
    }

    const visit = (href: string) => {
        onClose();
        router.visit(href);
    };

    return (
        <div className="fixed inset-0 z-[70]">
            <button type="button" aria-label="Close command palette" className="absolute inset-0 bg-gray-950/40" onClick={onClose} />
            <div className="relative mx-auto mt-20 w-[92vw] max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        autoFocus
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                                onClose();
                            }

                            if (event.key === 'Enter' && filteredItems[0]) {
                                visit(filteredItems[0].href);
                            }
                        }}
                        placeholder="Cari menu atau halaman..."
                        className="h-10 min-w-0 flex-1 border-0 p-0 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0"
                    />
                    <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        Esc
                    </button>
                </div>

                <div className="max-h-[420px] overflow-y-auto p-2">
                    {filteredItems.map((item) => (
                        <button
                            key={`${item.section}-${item.label}`}
                            type="button"
                            onClick={() => visit(item.href)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                                item.active ? 'bg-gray-100' : 'hover:bg-gray-50'
                            }`}
                        >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <SidebarIcon name={item.icon} />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-gray-900">{item.label}</span>
                                <span className="block truncate text-xs text-gray-400">{item.section}</span>
                            </span>
                            {item.active && <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-500">Aktif</span>}
                        </button>
                    ))}

                    {filteredItems.length === 0 && (
                        <div className="px-4 py-10 text-center text-sm text-gray-400">
                            Tidak ada menu yang cocok.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);

    const sections: NavSection[] = [
        {
            label: 'Main Navigation',
            items: [
                { label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard'), icon: 'dashboard' },
                { label: 'Pelanggan', href: route('customers.index'), active: route().current('customers.*'), icon: 'customers' },
                { label: 'Area', href: route('areas.index'), active: route().current('areas.*'), icon: 'area' },
            ],
        },
        {
            label: 'Tagihan',
            items: [
                { label: 'Tarif', href: route('tariffs.index'), active: route().current('tariffs.*'), icon: 'tariff' },
                { label: 'Periode', href: route('billing-periods.index'), active: route().current('billing-periods.*'), icon: 'period' },
                { label: 'Tagihan', href: route('bills.index'), active: route().current('bills.*'), icon: 'bill' },
                { label: 'Pembayaran', href: route('payments.index'), active: route().current('payments.*'), icon: 'payment' },
            ],
        },
        {
            label: 'Operasional',
            items: [
                { label: 'Mobile Petugas', href: route('mobile.customers.index'), active: route().current('mobile.*'), icon: 'mobile' },
                { label: 'Laporan', href: route('reports.index'), active: route().current('reports.*'), icon: 'report' },
            ],
        },
    ];

    const activeItem = useMemo(
        () => sections.flatMap((section) => section.items).find((item) => item.active),
        [sections],
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setCommandOpen(true);
            }

            if (event.key === 'Escape') {
                setCommandOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-gray-100 bg-white lg:flex">
                <SidebarContent sections={sections} onOpenCommand={() => setCommandOpen(true)} />
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close sidebar overlay"
                        className="absolute inset-0 bg-gray-950/40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="relative flex h-full w-72 max-w-[86vw] flex-col bg-white shadow-xl">
                        <div className="absolute right-3 top-3">
                            <button
                                type="button"
                                aria-label="Close sidebar"
                                onClick={() => setSidebarOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <SidebarContent
                            sections={sections}
                            onNavigate={() => setSidebarOpen(false)}
                            onOpenCommand={() => {
                                setSidebarOpen(false);
                                setCommandOpen(true);
                            }}
                        />
                        <div className="border-t border-gray-100 p-4">
                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                            <div className="mt-0.5 truncate text-xs text-gray-500">{user.email}</div>
                            <div className="mt-3 grid gap-1">
                                <Link href={route('profile.edit')} onClick={() => setSidebarOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Profile
                                </Link>
                                <Link href={route('logout')} method="post" as="button" className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            <div className="min-h-screen lg:ml-56">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Open sidebar"
                            onClick={() => setSidebarOpen(true)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Overview</span>
                            <span className="text-gray-300">/</span>
                            <span className="font-medium text-gray-900">{activeItem?.label ?? 'Dashboard'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button type="button" className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 01-3.46 0" />
                            </svg>
                            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                        </button>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setAccountOpen((open) => !open)}
                                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                                    {user.name
                                        .split(' ')
                                        .map((part) => part[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                                <div className="hidden min-w-0 text-left sm:block">
                                    <div className="max-w-32 truncate text-xs font-semibold text-gray-900">{user.name}</div>
                                    <div className="max-w-32 truncate text-xs text-gray-400">{user.email}</div>
                                </div>
                                <svg className="hidden h-3.5 w-3.5 text-gray-400 sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {accountOpen && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Close account menu"
                                        className="fixed inset-0 z-40 cursor-default"
                                        onClick={() => setAccountOpen(false)}
                                    />
                                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                                        <div className="border-b border-gray-100 px-3 py-2">
                                            <div className="truncate text-sm font-semibold text-gray-900">{user.name}</div>
                                            <div className="truncate text-xs text-gray-400">{user.email}</div>
                                        </div>
                                        <Link
                                            href={route('profile.edit')}
                                            onClick={() => setAccountOpen(false)}
                                            className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="block w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Log Out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {header && (
                    <section className="border-b border-gray-100 bg-white px-4 py-5 sm:px-6">
                        {header}
                    </section>
                )}

                <main>{children}</main>
            </div>

            <CommandPalette open={commandOpen} sections={sections} onClose={() => setCommandOpen(false)} />
        </div>
    );
}
