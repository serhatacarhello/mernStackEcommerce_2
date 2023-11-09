import React from 'react'

export default function Center({ children }) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 sm:flex-row sm:justify-between sm:items-center sm:gap-8">
        {children}
      </div>
    );
  }