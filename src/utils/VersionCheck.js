export const compareVersions = (version1, version2) => {
  const v1Components = version1.split('.').map(Number);
  const v2Components = version2.split('.').map(Number);

  const minLength = Math.min(v1Components.length, v2Components.length);

  for (let i = 0; i < minLength; i++) {
      if (v1Components[i] < v2Components[i]) {
          return -1;
      } else if (v1Components[i] > v2Components[i]) {
          return 1;
      }
  }

  // If the common components are equal, check the remaining components
  if (v1Components.length < v2Components.length) {
      return -1;
  } else if (v1Components.length > v2Components.length) {
      return 1;
  }

  // Both versions are equal
  return 0;
}