function getNameInitials(name){
  const names = name.split(' ')
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join('')
  return initials
}

function getFullName(token) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  return payload.name || '';
}

function getNameFromJWT(token) {
  try {
    const name = getFullName(token);
    return getNameInitials(name);
  } catch (error) {
    console.error('Error parsing JWT:', error)
    return null
  }
}

export { getNameInitials, getNameFromJWT , getFullName }