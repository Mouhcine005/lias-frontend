import { Outlet } from 'react-router-dom'
import Sidebar from './SideBar'
import TopBar from './TopBar'

export default function AppLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-lias-950">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto app-mesh">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
