import lockIcon from '../assets/imgs/lock.png';

import Button from '../components/ui/Button';
import FieldError from '../components/auth/FieldError';
import MessagePopUp from '../components/ui/MessagePopUp';
import PopUpOverlay from '../components/ui/PopUpOverlay';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PasswordField from '../components/auth/PasswordField';

import { AUTH_INPUT } from '../styles/classNames';
import { getThemeProfileBackground } from '../constants/themes';

import { isValidEmail, isValidUserName } from '../utils/validation';
import { PAGE_THEMES, useUserProfile } from '../hooks/useUserProfile';

const UserAccount = () => {
  const {
    profile,
    profileImage,
    isEditing,
    settingsOpen,
    selectedTheme,
    setSelectedTheme,
    popUp,
    setPopUp,
    isLoading,
    newName,
    setNewName,
    newEmail,
    setNewEmail,
    newPassword,
    setNewPassword,
    nameError,
    setNameError,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    saveTheme,
    toggleEdit,
    closePopUp,
    uploadPhoto,
    openSettings,
    closeSettings,
    handleConfirmAction,
  } = useUserProfile();

  const profileCoverBg = getThemeProfileBackground(
    selectedTheme ?? profile?.accountTheme ?? 'sunset',
  );

  if(isLoading && !profile)
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div>
      {settingsOpen && (
        <div className="fixed inset-0 bg-[rgba(28,28,28,0.24)] z-0" aria-hidden />
      )}

      {!settingsOpen && (
        <div className="w-[780px] mx-auto p-12 max-md:p-16 max-[480px]:p-9 relative overflow-hidden rounded-2xl bg-[var(--bg-profile-card)] shadow-[0_3px_12px_rgba(89,89,89,0.126)] z-[3]">
          <div
            className="absolute top-0 left-0 h-[220px] max-md:h-[174px] w-full -z-10 rounded-bl-[40px] rounded-br-[160px] bg-cover bg-center shadow-[0_3px_12px_rgba(89,89,89,0.232)]"
            style={{ backgroundImage: profileCoverBg }}
          />

          <div>
            <div className="grid grid-cols-[200px_2fr] gap-9 max-md:grid-cols-1 mb-6">
              <div className="flex flex-col justify-center gap-2 animate-fade-in">
                <label
                  htmlFor="select-file-input"
                  className="group flex justify-center items-center mx-auto rounded-full relative cursor-pointer border-[12px] border-white bg-[var(--bg-img-perfil)] transition-opacity duration-500"
                >
                  <img
                    src={profileImage}
                    id="profile-image"
                    alt="Perfil sem foto"
                    className="w-[170px] h-[170px] max-md:w-36 max-md:h-36 rounded-full object-cover shadow-profile-img transition-opacity duration-200 group-hover:opacity-[0.69]"
                  />

                  <p className="text-center absolute max-w-[85px] text-xs p-4 rounded-xl bg-white/70 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500">
                    Change profile picture
                  </p>
                </label>

                <input
                  id="select-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={event => {
                    const file = event.target.files?.[0];

                    if(file)
                      void uploadPhoto(file);
                  }}
                />

                <h3 className="text-center font-medium leading-tight mt-0 mb-2 text-[clamp(1.3rem,1.3rem+0.6vw,2rem)]">
                  {profile?.name ?? '---'}
                </h3>
              </div>

              <div
                className={`flex flex-col gap-4 w-full p-4 rounded-md animate-fade-in bg-[var(--bg-descryption)] border-l-4 border-secondary shadow-bio${isEditing ? ' max-[480px]:p-5' : ''}`}
              >
                <div>
                  <p className="text-[var(--color-p-bio-item)] mb-0.5">Username:</p>
                  {!isEditing && (
                    <h5 className="text-lg font-semibold text-[var(--color-profile-info)] m-0">
                      {profile?.name}
                    </h5>
                  )}

                  {isEditing && (
                    <div className="relative w-full">
                      <FieldError message={nameError} inputId="new-name" edit />
                      <input
                        type="text"
                        id="new-name"
                        autoComplete="off"
                        className={AUTH_INPUT}
                        value={newName}
                        placeholder={profile?.name ?? 'New Username'}
                        onChange={event => setNewName(event.target.value)}
                        onBlur={() => {
                          newName && !isValidUserName(newName)
                            ? setNameError('Minimum of 6 characters.')
                            : setNameError('');
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[var(--color-p-bio-item)] mb-0.5">E-mail:</p>
                  {!isEditing && (
                    <h5 className="text-lg font-semibold text-[var(--color-profile-info)] m-0">
                      {profile?.email}
                    </h5>
                  )}

                  {isEditing && (
                    <div className="relative w-full">
                      <FieldError message={emailError} inputId="new-email" edit />
                      <input
                        type="text"
                        name="email"
                        id="new-email"
                        autoComplete="email"
                        className={AUTH_INPUT}
                        value={newEmail}
                        placeholder={profile?.email ?? 'New Email'}
                        onChange={event => setNewEmail(event.target.value)}
                        onBlur={() => {
                          newEmail && !isValidEmail(newEmail)
                            ? setEmailError('Invalid email address.')
                            : setEmailError('');
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className={`text-[var(--color-p-bio-item)] mb-0.5 ${isEditing ? ' text-lg mb-2 text-[var(--color-p-bio-item-active)]' : ''}`}>
                    Password:
                  </p>

                  {!isEditing && (
                    <h5 className="text-lg font-semibold text-[var(--color-profile-info)] m-0">
                      ••••••••
                    </h5>
                  )}

                  {isEditing && (
                    <div className="relative w-full">
                      <PasswordField
                        id="new-password"
                        placeholder="Digite sua nova senha"
                        icon={lockIcon}
                        value={newPassword}
                        error={passwordError}
                        showRequirements
                        onChange={setNewPassword}
                        onBlurValidate={valid => {
                          !valid && newPassword
                            ? setPasswordError('Please enter a valid password.')
                            : setPasswordError('');
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              {!isEditing && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between gap-4 max-md:flex-wrap">
                    <Button
                      type="button"
                      variant="surface"
                      id="edit-profile-btn"
                      className="animate-fade-in"
                      onClick={toggleEdit}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      type="button"
                      variant="surface"
                      id="open-settings-btn"
                      className="animate-fade-in"
                      onClick={openSettings}
                    >
                      Settings
                    </Button>
                  </div>
                  <Button
                    type="button"
                    id="logout-btn"
                    variant="surface"
                    className="animate-fade-in-medium"
                    onClick={() => setPopUp({
                      kind:     'confirm',
                      type:     'logout',
                      title:    'Sign Out?',
                      message:  'Are you sure you want to sign out?',
                      ctaLabel: 'Sign Out',
                      action:   'logout',
                    })}
                  >
                    Logout
                  </Button>
                </div>
              )}

              {isEditing && (
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    id="save-changes-btn"
                    variant="surface"
                    className="animate-fade-in w-full"
                    onClick={() => setPopUp({
                      kind:     'confirm',
                      type:     'edit',
                      title:    'Save Changes?',
                      message:  'Are you sure you want to update your information?',
                      ctaLabel: 'Save Changes',
                      action:   'edit',
                    })}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    id="cancel-edit-btn"
                    variant="surface"
                    className="animate-fade-in w-full"
                    onClick={toggleEdit}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="w-full max-w-[890px] mx-auto p-12 rounded-2xl relative z-[4] bg-[var(--bg-settings)] shadow-settings">
          <button
            type="button"
            id="close-settings"
            className="absolute top-12 right-12 text-xl p-0 text-[#888888] border-0 bg-transparent cursor-pointer"
            onClick={closeSettings}
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <div>
            <div>
              <h3>Select Theme</h3>
              <p className="mb-4 text-[1.012rem]">
                🌿 Personalize your workspace to make it more comfortable!
              </p>
            </div>
            <div className="flex justify-between flex-wrap gap-6">
              {PAGE_THEMES.map(theme => (
                <div
                  key={theme.slug}
                  role="button"
                  tabIndex={0}
                  data-selected={selectedTheme === theme.slug}
                  className="p-0 w-full cursor-pointer overflow-hidden max-w-60 h-fit rounded-xl border-[3px] border-[#D9D9D9] bg-[var(--bg-theme-box)] transition-all duration-200 hover:scale-[1.002] hover:-translate-y-px hover:shadow-theme-box data-[selected=true]:border-[var(--input-focus-border)] data-[selected=true]:shadow-[var(--input-focus-shadow)]"
                  onClick={() => setSelectedTheme(theme.slug)}
                  onKeyDown={event => {
                    if(event.key === 'Enter' || event.key === ' ')
                      setSelectedTheme(theme.slug);
                  }}
                >
                  <div className="overflow-hidden max-h-[120px]">
                    <img src={theme.cover} alt="Theme preview" className="w-full h-full object-fill" />
                  </div>

                  <div className="flex items-center gap-1.5 p-4">
                    <div
                      className={`w-[19px] h-[19px] rounded-full border-[3px]${selectedTheme === theme.slug ? ' border-[var(--input-focus-border)] shadow-[var(--input-focus-shadow)]' : ' border-[#d5d5d5]'}`}
                    />
                    <h4 className="mb-0 text-[1.012rem]">{theme.label}</h4>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="settings"
                id="save-selected-theme"
                className="animate-fade-in"
                onClick={() => void saveTheme()}
              >
                Save Theme
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <div>
              <h3 className="font-medium leading-tight mt-0 mb-2 text-[clamp(1.3rem,1.3rem+0.6vw,2rem)]">
                Account
              </h3>
              <p className="mb-4">
                Deleting your account will erase all your data permanently. Are you sure about this?
              </p>
            </div>
            <Button
              type="button"
              id="remove-account-btn"
              variant="settings"
              className="animate-fade-in"
              onClick={() => setPopUp({
                kind:     'confirm',
                type:     'delete',
                title:    'Delete Account?',
                message:  'Are you sure you want to delete your account? <br><strong>This action is permanent and cannot be undone.</strong>',
                ctaLabel: 'Delete Account',
                action:   'delete',
              })}
            >
              Delete Account
            </Button>
          </div>
        </div>
      )}

      <PopUpOverlay active={Boolean(popUp)}>
        {popUp?.kind === 'message' && (
          <MessagePopUp
            type={popUp.type}
            title={popUp.title}
            message={popUp.message}
            onClose={closePopUp}
          />
        )}
        {popUp?.kind === 'confirm' && (
          <ConfirmDialog
            type={popUp.type}
            title={popUp.title}
            message={popUp.message}
            ctaLabel={popUp.ctaLabel}
            onCancel={closePopUp}
            onConfirm={() => handleConfirmAction(popUp.action)}
          />
        )}
      </PopUpOverlay>
    </div>
  );
};

export default UserAccount;
