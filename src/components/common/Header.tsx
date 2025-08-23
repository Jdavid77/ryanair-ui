import { RyanairLogo } from './RyanairLogo';

export function Header() {
  return (
    <header className="bg-primary-500 border-b border-primary-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <RyanairLogo size="md" className="bg-white text-primary-500" />
            <div>
              <h1 className="text-xl font-bold text-white">Ryanair</h1>
              <p className="text-sm text-primary-100 hidden sm:block">Europe's Favourite Airline</p>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
}