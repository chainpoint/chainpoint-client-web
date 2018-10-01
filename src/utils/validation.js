const validateSha256 = hash => {
  return /^[A-Fa-f0-9]{64}$/.test(hash)
}

export { validateSha256 }
