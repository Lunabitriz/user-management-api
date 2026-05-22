const KEYS = {
  userId:      'userId',
  userName:    'userName',
  userEmail:   'userEmail',
  userPhoto:   'userPhoto',
  userTheme:   'userTheme',
  rememberMe:  'rememberMe',
  accessToken: 'access_token',
} as const;

export const storage = {
  getUserId:      () => localStorage.getItem(KEYS.userId),
  getUserName:    () => localStorage.getItem(KEYS.userName),
  getUserEmail:   () => localStorage.getItem(KEYS.userEmail),
  getUserPhoto:   () => localStorage.getItem(KEYS.userPhoto),
  getUserTheme:   () => localStorage.getItem(KEYS.userTheme),
  getRememberMe:  () => localStorage.getItem(KEYS.rememberMe),
  getAccessToken: () => localStorage.getItem(KEYS.accessToken),

  isAuthenticated: () => {
    const userId = localStorage.getItem(KEYS.userId);
    const token  = localStorage.getItem(KEYS.accessToken);

    return Boolean(token && userId);
  },

  persistSession: (payload: {
    accessToken:   string
    userId:        number
    userName:      string
    userEmail:     string
    rememberMe:    boolean
    profileImage?: string | null
    accountTheme?: string | null
  }) => {

    localStorage.setItem(KEYS.userName, payload.userName);
    localStorage.setItem(KEYS.userEmail, payload.userEmail);
    localStorage.setItem(KEYS.userId, String(payload.userId));
    localStorage.setItem(KEYS.accessToken, payload.accessToken);
    localStorage.setItem(KEYS.rememberMe, payload.rememberMe ? 'active' : 'disabled');

    if(payload.profileImage)
      localStorage.setItem(KEYS.userPhoto, payload.profileImage);

    if(payload.accountTheme) {
      localStorage.setItem(KEYS.userTheme, payload.accountTheme);
      document.documentElement.setAttribute('data-theme', payload.accountTheme);
    }
  },

  clearSession: (keepRememberedEmail = false) => {
    const userEmail  = localStorage.getItem(KEYS.userEmail);
    const rememberMe = localStorage.getItem(KEYS.rememberMe);

    localStorage.removeItem(KEYS.userId);
    localStorage.removeItem(KEYS.userName);
    localStorage.removeItem(KEYS.userPhoto);
    localStorage.removeItem(KEYS.userTheme);
    localStorage.removeItem(KEYS.accessToken);

    keepRememberedEmail && rememberMe === 'active' && userEmail
      ? localStorage.setItem(KEYS.userEmail, userEmail)
      : localStorage.removeItem(KEYS.userEmail);

    localStorage.removeItem(KEYS.rememberMe);
  },

  clearRecoveryState: () => {
    localStorage.removeItem('enterCode');
    localStorage.removeItem('recoveryEmail');
    localStorage.removeItem('currentSeconds');
    localStorage.removeItem('currentMinutes');
    localStorage.removeItem('passwordRedefined');
  },
};
