export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}

export function getUserRole() {
  return localStorage.getItem("role") || "GUEST";
}

export function hasAnyRole(roles = []) {
  const currentRole = getUserRole().toUpperCase();
  return roles.some((role) => role.toUpperCase() === currentRole);
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
}

export function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location = "/login";
  }
}
