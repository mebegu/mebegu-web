// All local URLs go through this helper so /repo-name/ deployments also work.
export const href = (path = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
