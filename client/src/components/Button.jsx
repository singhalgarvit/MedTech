import React from 'react'

function Button({type="button",value,disabled,onclick,className,icon}) {
  return (
    <button type={type} onClick={onclick} disabled={disabled} className={`border w-24 rounded bg-blue-800 text-white disabled:bg-blue-200 ${className}`}>
        {value}
        {icon && <>{icon}</>}
    </button>
  )
}

export default Button