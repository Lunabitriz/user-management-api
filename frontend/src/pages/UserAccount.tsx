import lockIcon from '../assets/imgs/lock.png';

import FieldError from '../components/auth/FieldError';
import MessagePopUp from '../components/ui/MessagePopUp';
import PopUpOverlay from '../components/ui/PopUpOverlay';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PasswordField from '../components/auth/PasswordField';

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

  if(isLoading && !profile)
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div>
      <div id="overflow" className={settingsOpen ? 'active' : ''} />

      <div
        id="container"
        className="w-full mx-auto p-12 relative overflow-hidden rounded-2xl"
        style={{ display: settingsOpen ? 'none' : 'block' }}
      >
        <div id="bg-card-img" className="w-full absolute" />

        <div id="profile-display">
          <div className="profile-grid grid mb-6">
            <div className="flex flex-col justify-center gap-2 fade-in">
              <label
                htmlFor="select-file-input"
                className="img-perfil flex justify-center items-center mx-auto rounded-full relative"
              >
                <img
                  src={profileImage}
                  id="profile-image"
                  alt="Perfil sem foto"
                  className="rounded-full"
                />
                
                <p id="change-img-msg" className="text-center absolute w-full p-4 rounded">
                  Change profile picture
                </p>
              </label>

              <input
                id="select-file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={event => {
                  const file = event.target.files?.[0];
                
                  if(file) 
                    void uploadPhoto(file);
                }}
              />

              <h3
                id="account-name"
                style={{ fontSize: 'calc(1.3rem + 0.6vw)' }}
                className="text-center font-medium leading-tight mt-0 mb-2"
              >
                {profile?.name ?? '---'}
              </h3>
            </div>

            <div
              id="bio-descryption"
              className={`flex flex-col gap-4 w-full p-4 rounded-md fade-in${isEditing ? ' active' : ''}`}
            >
              <div className="bio-item">
                <p>Username:</p>
                <h5
                  id="name-profile"
                  className="profile-info"
                  style={{ display: isEditing ? 'none' : 'block' }}
                >
                  {profile?.name}
                </h5>

                <div className="input-item relative">
                  <FieldError message={nameError} inputId="new-name" />
                
                  <input
                    type="text"
                    id="new-name"
                    autoComplete="off"
                    className="edit-input"
                    value={newName}
                    placeholder={profile?.name ?? 'New Username'}
                    style={{ display: isEditing ? 'block' : 'none' }}
                    onChange={event => setNewName(event.target.value)}
                    onBlur={() => {
                      newName && !isValidUserName(newName)
                      ? setNameError('Minimum of 6 characters.')
                      : setNameError('');
                    }}
                  />
                </div>
              </div>

              <div className="bio-item">
                <p>E-mail:</p>
                <h5
                  id="email-profile"
                  className="profile-info"
                  style={{ display: isEditing ? 'none' : 'block' }}
                >
                  {profile?.email}
                </h5>

                <div className="input-item relative">

                  <FieldError message={emailError} inputId="new-email" />
                  <input
                    type="text"
                    name="email"
                    id="new-email"
                    className="edit-input"
                    autoComplete="email"
                    value={newEmail}
                    placeholder={profile?.email ?? 'New Email'}
                    style={{ display: isEditing ? 'block' : 'none' }}
                    onChange={event => setNewEmail(event.target.value)}
                    onBlur={() => {
                      newEmail && !isValidEmail(newEmail)
                      ? setEmailError('Invalid email address.')
                      : setEmailError('');
                    }}
                  />
                </div>
              </div>

              <div className="bio-item relative">
                <p>Password:</p>

                <div className="flex items-center gap-1">
                  <h5
                    id="password-profile"
                    className="profile-info"
                    style={{ marginBottom: 0, display: isEditing ? 'none' : 'block' }}
                  >
                    ••••••••
                  </h5>
                </div>

                <div
                  id="new-password-container"
                  className="input-item relative"
                  style={{ display: isEditing ? 'block' : 'none' }}
                >
                  <PasswordField
                    id="new-password"
                    inputClass="edit-input"
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

                  <div id="profile-edit-password-validations" />
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <div
              id="account-options"
              className={`flex flex-col gap-4${!isEditing ? ' active' : ''}`}
            >
              <div id="row-buttons" className="flex justify-between gap-4">
                <button
                  type="button"
                  id="edit-profile-btn"
                  className="fade-in btn"
                  onClick={toggleEdit}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  id="open-settings-btn"
                  className="fade-in btn"
                  onClick={openSettings}
                >
                  Settings
                </button>
              </div>
              <button
                type="button"
                id="logout-btn"
                className="fade-in-medium btn"
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
              </button>
            </div>

            <div 
              id="edit-options" 
              className={`flex flex-col gap-4${isEditing ? ' active' : ''}`}
            >
              <button
                type="button"
                id="save-changes-btn"
                className="edit-btn fade-in btn"
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
              </button>
              <button
                type="button"
                id="cancel-edit-btn"
                className="fade-in btn"
                onClick={toggleEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="settings"
        className="w-full p-12 rounded-2xl relative"
        style={{ display: settingsOpen ? 'block' : 'none' }}
      >
        <button
          type="button"
          id="close-settings"
          className="absolute text-xl p-0"
          style={{ top: '1rem', right: '1rem' }}
          onClick={closeSettings}
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <div id="themes-section" className="themes-grid">
          <div className="header-settings">
            <h3>Select Theme</h3>
            <p className="mb-4">
              🌿 Personalize your workspace to make it more comfortable!
            </p>
          </div>
          <div className="flex justify-between flex-wrap gap-6">
            {PAGE_THEMES.map(theme => (
              <div
                key={theme.slug}
                className={`theme-box${selectedTheme === theme.slug ? ' selected' : ''}`}
                data-theme={`${theme.slug}-theme`}
                onClick={() => setSelectedTheme(theme.slug)}
                onKeyDown={() => setSelectedTheme(theme.slug)}
                role="button"
                tabIndex={0}
              >
                <div className="theme-image">
                  <img src={theme.cover} alt="Theme Image" />
                </div>

                <div className="theme-header flex items-center">
                  <div className="circle-theme rounded-full" />
                  <h4 className="mb-0">{theme.label}</h4>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="fade-in btn"
              id="save-selected-theme"
              onClick={() => void saveTheme()}
            >
              Save Theme
            </button>
          </div>
        </div>

        <div id="account-settings" className="mt-12">
          <div className="header-settings">
            <h3
              style={{ fontSize: 'calc(1.3rem + 0.6vw)' }}
              className="font-medium leading-tight mt-0 mb-2"
            >
              Account
            </h3>
            <p className="mb-4">
              Deleting your account will erase all your data permanently. Are you sure about this?
            </p>
          </div>
          <button
            type="button"
            id="remove-account-btn"
            className="fade-in btn"
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
          </button>
        </div>
      </div>

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

      <div id="pop-up-container" style={{ position: 'absolute', zIndex: 1000 }} />
    </div>
  );
};

export default UserAccount;
