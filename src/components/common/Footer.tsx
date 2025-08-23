import { HeartIcon } from '@heroicons/react/24/outline';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ryanair Flights</h3>
            <p className="text-gray-600 text-sm mb-4">
              Find the best flight deals across Europe with Ryanair. 
              Compare prices, explore destinations, and book your next adventure.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Made with</span>
              <HeartIcon className="w-4 h-4 mx-1 text-red-500" />
              <span>using the Ryanair API</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Search Flights
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Popular Destinations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Airport Information
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://github.com/example/ryanair-api" 
                   className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                   target="_blank" 
                   rel="noopener noreferrer">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 Ryanair Flights App. This is a demonstration app using the Ryanair API.
            </p>
            <div className="mt-4 sm:mt-0">
              <p className="text-sm text-gray-500">
                Built with React, TypeScript & Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}