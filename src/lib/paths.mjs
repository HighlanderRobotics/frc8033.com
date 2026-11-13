export function createPaths(base = '/') {
  const prefix = '/' + base.split('/').filter(Boolean).join('/');
  const root = prefix === '/' ? '/' : prefix + '/';
  function withBase(value) {
    if (!value || !value.startsWith('/') || value.startsWith('//')) return value;
    if (prefix === '/' || value === prefix || value.startsWith(root) || value.startsWith(prefix + '?') || value.startsWith(prefix + '#')) return value;
    return prefix + value;
  }
  function withoutBase(value) {
    const pathname = value === prefix ? '/' : value.startsWith(root) ? '/' + value.slice(root.length) : value;
    return pathname.replace(/\/$/, '') || '/';
  }
  function srcset(value) {
    if (!value || value.includes('data:')) return value;
    return value.split(/,\s*/).map(candidate => candidate.replace(/^(\S+)/, url => withBase(url))).join(', ');
  }
  return { withBase, withoutBase, srcset, root };
}
