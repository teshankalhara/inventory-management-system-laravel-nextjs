import {
    LayoutDashboard,
    Users,
    ArchiveX,
    MapPin,
    Package,
    BookOpen,
    ClipboardList,
    ActivityIcon,
} from 'lucide-react';

export const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { href: '/items', label: 'Inventory', icon: Package, adminOnly: false },
    { href: '/borrow-records', label: 'Borrow Records', icon: BookOpen, adminOnly: false },
    { href: '/borrow', label: 'Borrow Item', icon: ClipboardList, adminOnly: false },
    { href: '/cupboards', label: 'Cupboards', icon: ArchiveX, adminOnly: true },
    { href: '/places', label: 'Places', icon: MapPin, adminOnly: true },
    { href: '/activity-logs', label: 'Activity Logs', icon: ActivityIcon, adminOnly: true },
    { href: '/users', label: 'Users', icon: Users, adminOnly: true },
];