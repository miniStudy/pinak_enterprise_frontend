import React from 'react'
import { Outlet } from 'react-router-dom';
import './mystyle.css';

function BaseLayout() {
  return (
    <>
 
  <button
    data-drawer-target="default-sidebar"
    data-drawer-toggle="default-sidebar"
    aria-controls="default-sidebar"
    type="button"
    className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
  >
    <span className="sr-only">Open sidebar</span>
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      />
    </svg>
  </button>
  <aside
    id="default-sidebar"
    className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidenav"
  >
    <div className="overflow-y-auto py-2 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div className="mb-2 flex justify-start items-center">
            <img
              src="static/pinak enterprise gujrati logo_page-0001.jpg"
              alt="Logo"
              className="w-40 rounded-full"
            />
    </div>
    <hr/>
      <ul className="space-y-2 mt-2">
        <li>
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-regular fa-building iconsize"></i></span>
            <span className="ml-3">Company Data</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-building-columns iconsize"></i></span>
            <span className="ml-3">Banks</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-tractor iconsize"></i></span>
            <span className="ml-3">Machines</span>
          </a>
        </li>


        <li>
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-screwdriver-wrench iconsize"></i></span>
            <span className="ml-3">Maintenance</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-poo-storm iconsize"></i></span>
            <span className="ml-3">Projects</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-user-group iconsize"></i></span>
            <span className="ml-3">Persons</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-recycle iconsize"></i></span>
            <span className="ml-3">Materials</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-chart-simple iconsize"></i></span>
            <span className="ml-3">Reports</span>
          </a>
        </li>
      
   
      
      </ul>
    
    </div>
    
  </aside>
    
      <div className='maincontent'>
      <Outlet />
      </div>
    </>
  )
}

export default BaseLayout