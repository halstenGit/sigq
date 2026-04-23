import { useState } from 'react'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            <h1 className="text-xl font-bold">SIGQ</h1>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => onNavigate('empreendimentos')}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 'empreendimentos'
                  ? 'bg-blue-800'
                  : 'hover:bg-blue-700'
              }`}
            >
              📋 Empreendimentos
            </button>

            <button
              onClick={() => onNavigate('rncs')}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 'rncs' ? 'bg-blue-800' : 'hover:bg-blue-700'
              }`}
            >
              📷 RNCs
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
