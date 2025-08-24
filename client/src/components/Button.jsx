import React from 'react'

function Button({type="button",value,disabled,onclick}) {
  return (
    <button type={type} onClick={onclick} disabled={disabled} className='border w-24 mt-3 rounded bg-blue-800 text-white disabled:bg-blue-200'>
        {value}
    </button>
  )
}

export default Button