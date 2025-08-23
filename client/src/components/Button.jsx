import React from 'react'

function Button({type="button",value}) {
  return (
    <button type={type} className='border w-24 mt-3 rounded bg-blue-800 text-white'>
        {value}
    </button>
  )
}

export default Button