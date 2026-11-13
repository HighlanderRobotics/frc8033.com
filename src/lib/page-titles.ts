const content = import.meta.glob('../content/pages/*.json', { eager: true, import: 'default' });
export const pageTitles = Object.fromEntries(Object.values(content).map((page: any) => [page.route, page.title]));
pageTitles['/search'] = 'Find Robots, People & Projects | Highlander Robotics';
export const linkTitle = (href: string) => href?.startsWith('/') && !href.startsWith('//')
  ? pageTitles[href.split(/[?#]/)[0].replace(/\/$/, '') || '/']
  : undefined;
