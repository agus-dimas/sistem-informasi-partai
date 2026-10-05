import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Newspaper,
    MessageSquare,
    Users,
    Sliders,
    Globe,
    ChevronRight,
    Home,
    Info,
    Network,
    Video,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { Auth } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { isCurrentUrl } = useCurrentUrl();
    const userRole = (auth?.user?.role as string) || 'user';
    const isAdmin = ['admin', 'super_admin'].includes(userRole);
    const isSuperAdmin = userRole === 'super_admin';

    const isCustomizeActive =
        isCurrentUrl('/dashboard/customize') ||
        isCurrentUrl('/dashboard/customize/about') ||
        isCurrentUrl('/dashboard/customize/struktur') ||
        isCurrentUrl('/dashboard/customize/media');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href="/dashboard" className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#b3181f] p-1.5 shadow-md">
                                    <img
                                        src="/images/update logo/LogoNavbar.png"
                                        alt="Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-bold tracking-tight text-foreground">
                                        PARTAI GARUDA
                                    </span>
                                    <span className="text-[11px] font-medium text-muted-foreground uppercase">
                                        {userRole.replace('_', ' ')}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Menu */}
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Navigasi</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isCurrentUrl('/dashboard')} tooltip="Dashboard">
                                <Link href="/dashboard">
                                    <LayoutGrid />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* Admin & Super Admin Items */}
                        {isAdmin && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl('/dashboard/news/create')}
                                        tooltip="Input Berita"
                                    >
                                        <Link href="/dashboard/news/create">
                                            <Newspaper />
                                            <span>Input Berita</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl('/dashboard/konsultasi')}
                                        tooltip="Konsultasi Masuk"
                                    >
                                        <Link href="/dashboard/konsultasi">
                                            <MessageSquare />
                                            <span>Konsultasi Masuk</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        )}

                        {/* Regular User Item */}
                        {!isAdmin && (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl('/konsultasi')}
                                    tooltip="Input Konsultasi"
                                >
                                    <Link href="/konsultasi">
                                        <MessageSquare />
                                        <span>Input Konsultasi</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}

                        {/* Super Admin Management */}
                        {isSuperAdmin && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl('/dashboard/users')}
                                        tooltip="Manajemen User"
                                    >
                                        <Link href="/dashboard/users">
                                            <Users />
                                            <span>Manajemen User</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Customize Collapsible */}
                                <Collapsible
                                    asChild
                                    defaultOpen={isCustomizeActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip="Customize Tampilan"
                                                isActive={isCustomizeActive}
                                            >
                                                <Sliders />
                                                <span>Customize</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentUrl('/dashboard/customize')}
                                                    >
                                                        <Link href="/dashboard/customize">
                                                            <Home className="size-3.5" />
                                                            <span>Home</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentUrl('/dashboard/customize/about')}
                                                    >
                                                        <Link href="/dashboard/customize/about">
                                                            <Info className="size-3.5" />
                                                            <span>About Us</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentUrl('/dashboard/customize/struktur')}
                                                    >
                                                        <Link href="/dashboard/customize/struktur">
                                                            <Network className="size-3.5" />
                                                            <span>Struktur</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentUrl('/dashboard/customize/media')}
                                                    >
                                                        <Link href="/dashboard/customize/media">
                                                            <Video className="size-3.5" />
                                                            <span>Media</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            </>
                        )}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Public Link */}
                <SidebarGroup className="mt-auto">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Lihat Website">
                                <Link href="/" target="_blank">
                                    <Globe />
                                    <span>Lihat Website</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
