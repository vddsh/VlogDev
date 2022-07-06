import React from 'react';
import Link from 'next/link';


const Header: React.FC = () => {

  return (
    <header>
      <div className="flex items-center space-x-5 p-5 max-w-7xl mx-auto">
        <Link href="/">
          <img className="w-44 object-contain cursor-pointer h-20" src="/logo.png" alt="logo"/>
        </Link>
        <div className="inline-flex items-center space-x-5">
          <Link href="/about">
            <h3 className="cursor-pointer">About</h3>
          </Link>
          <div className="relative group">
            <h3 className="text-white bg-blue-600 px-4 py-1 rounded cursor-pointer">Search</h3>
            <div
              className="opacity-0 group-hover:opacity-100 duration-300 absolute bottom-6 left-10 bg-white border rounded w-32">In
              establishing
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;