import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, Tags } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: Tags },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-neutral-50">
      <div className="w-64 border-r bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl tracking-tight text-neutral-900">
          AdminPanel
        </div>
        <div className="flex-1 py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8">
            <h2 className="text-lg font-semibold capitalize text-neutral-800">
                {location.pathname.replace('/', '')}
            </h2>
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-neutral-200" />
            </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
