import kumaCover from '../assets/imgs/profile-cover-themes/kuma-cover.jpg';
import sunsetCover from '../assets/imgs/profile-cover-themes/sunset-cover.jpg';
import eastBlueCover from '../assets/imgs/profile-cover-themes/east-blue-cover.jpg';

export type ThemeSlug = 'sunset' | 'east-blue' | 'kuma';

export const THEME_SLUGS: ThemeSlug[] = ['sunset', 'east-blue', 'kuma'];

export const THEME_TOKENS = {
  sunset: {
    slug:      'sunset' as const,
    label:     'Sunset',
    primary:   '#f37913',
    secondary: '#E67137',
    cover:     sunsetCover,
    profileBg: "url('/imgs/profile-cover-themes/sunset-theme.png')",
  },
  'east-blue': {
    slug:      'east-blue' as const,
    label:     'East Blue',
    primary:   '#009FDB',
    secondary: '#00A5E0',
    cover:     eastBlueCover,
    profileBg: "url('/imgs/profile-cover-themes/east-blue-theme.jpg')",
  },
  kuma: {
    slug:      'kuma' as const,
    label:     'Kuma',
    primary:   '#4C8C64',
    secondary: '#47855F',
    cover:     kumaCover,
    profileBg: "url('/imgs/profile-cover-themes/kuma-theme.jpg')",
  },
} as const;

export const PAGE_THEMES = THEME_SLUGS.map(slug => ({
  slug,
  label: THEME_TOKENS[slug].label,
  cover: THEME_TOKENS[slug].cover,
}));

export const getThemeProfileBackground = (slug: string | null | undefined): string =>
  THEME_TOKENS[(slug as ThemeSlug) ?? 'sunset']?.profileBg ?? THEME_TOKENS.sunset.profileBg;

export const applyDocumentTheme = (theme: string | null | undefined): void => {
  const themeSlug = theme ?? 'sunset';

  localStorage.setItem('theme', themeSlug);
  localStorage.setItem('userTheme', themeSlug);

  themeSlug === 'sunset'
    ? document.documentElement.removeAttribute('data-theme')
    : document.documentElement.setAttribute('data-theme', themeSlug);
};
