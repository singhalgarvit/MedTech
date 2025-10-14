import React from 'react'

function Modal({children, isOpen, onClose   }) {
  if (!isOpen) return null

  return (
    <div className="modal fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-10" onClick={onClose}>
      <div className="modal-content bg-white p-4 rounded-md shadow-lg relative w-11/12 md:w-1/2 lg:w-1/3" onClick={(e) => e.stopPropagation()}>
        <span className="close-button text-2xl cursor-pointer" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  )
}

export default Modal