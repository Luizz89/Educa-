export function validateStudentProfile(displayName: string, bio: string) {
  const name = displayName.trim().replace(/\s+/g, ' ');
  return {
    displayName: name.length < 2
      ? 'Informe um nome com pelo menos 2 caracteres.'
      : name.length > 60 ? 'Use até 60 caracteres no nome.' : undefined,
    bio: bio.trim().length > 160 ? 'Use até 160 caracteres na descrição.' : undefined,
  };
}

export function getStudentInitials(displayName: string) {
  return displayName.trim().split(/\s+/).slice(0, 2).map((name) => name.charAt(0)).join('').toUpperCase();
}
