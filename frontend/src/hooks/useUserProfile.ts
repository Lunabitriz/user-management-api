import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { userApi } from '../api/user';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  applyDocumentTheme,
  PAGE_THEMES,
} from '../constants/themes';

import type { UserProfile } from '../types/api';

import profileImgDefault from '../assets/imgs/profile-img-default.jpg';

import {
  isValidEmail,
  isPasswordValid,
  isValidUserName,
} from '../utils/validation';

export { PAGE_THEMES };

type PopUpState =
  | { kind: 'message'; type: string; title: string; message: string }
  | { kind: 'confirm'; type: string; title: string; message: string; ctaLabel: string; action: 'edit' | 'logout' | 'delete' }
  | null;

export const useUserProfile = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const { notify } = useNotification();

  const [isLoading,    setIsLoading]      = useState(true);
  const [isEditing,    setIsEditing]      = useState(false);
  const [settingsOpen, setSettingsOpen]   = useState(false);
  const [profileImage, setProfileImage]   = useState(profileImgDefault);

  const [newName,     setNewName]         = useState('');
  const [newEmail,    setNewEmail]        = useState('');
  const [newPassword, setNewPassword]     = useState('');

  const [nameError,     setNameError]     = useState('');
  const [emailError,    setEmailError]    = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [popUp,         setPopUp]         = useState<PopUpState>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [profile,       setProfile]       = useState<UserProfile | null>(null);

  const userId = Number(storage.getUserId());

  const loadProfile = useCallback(async () => {
    if(!storage.isAuthenticated()) {
      notify('User not authenticated. Redirecting to login page...', 'warning');

      navigate('/');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userApi.getById(userId);

      if(!response.data) {
        notify(response.message || 'Failed to load profile.', 'warning');
        return;
      }

      const user = response.data;

      setProfile(user);
      applyDocumentTheme(user.accountTheme);
      setSelectedTheme(user.accountTheme ?? 'sunset');
      setProfileImage(user.profileImage ?? profileImgDefault);

      storage.persistSession({
        userId:       user.id,
        userName:     user.name,
        userEmail:    user.email,
        profileImage: user.profileImage,
        accountTheme: user.accountTheme,
        accessToken:  storage.getAccessToken() ?? '',
        rememberMe:   storage.getRememberMe() === 'active',
      });
    } catch {
      notify('Failed to load user data.', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, notify, userId]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const toggleEdit = useCallback(() => {
    setIsEditing(prev => !prev);
    setNewName('');
    setNewEmail('');
    setNameError('');
    setEmailError('');
    setNewPassword('');
    setPasswordError('');
  }, []);
  
  const openSettings = useCallback(() => {
    setSettingsOpen(true);
    setSelectedTheme(profile?.accountTheme ?? storage.getUserTheme() ?? 'sunset');
  }, [profile?.accountTheme]);
  
  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
    setSelectedTheme(profile?.accountTheme ?? storage.getUserTheme());
  }, []);
  
  const closePopUp = useCallback(() => setPopUp(null), []);
  
  const saveTheme = useCallback(async () => {
    if(!selectedTheme) return;
    
    const response = await userApi.update({
      id: userId,
      accountTheme: selectedTheme,
    });

    if(response.data) {
      applyDocumentTheme(selectedTheme);
      setProfile(response.data);

      setPopUp({
        kind:    'message',
        type:    'success',
        title:   'Update Successful',
        message: 'Theme saved successfully!',
      });

      closeSettings();
    } else {
      setPopUp({
        kind:    'message',
        type:    'error',
        title:   'Save Error',
        message: 'Failed to upload theme to the database.',
      });
    }
  }, [closeSettings, selectedTheme, userId]);

  const saveChanges = useCallback(async () => {
    if(!newName.trim() && !newEmail.trim() && !newPassword.trim()) {
      setPopUp({
        kind:    'message',
        type:    'error',
        title:   'Update Error',
        message: 'Please enter valid data to update.',
      });

      return;
    }

    if(newName.trim() && !isValidUserName(newName))
      return;

    if(newEmail.trim() && !isValidEmail(newEmail))
      return;

    if(newPassword.trim() && !isPasswordValid(newPassword))
      return;

    const response = await userApi.update({
      id:       userId,
      name:     newName.trim()     || undefined,
      email:    newEmail.trim()    || undefined,
      password: newPassword.trim() || undefined,
    });

    if(response.data) {
      setProfile(response.data);

      setPopUp({
        kind:    'message',
        type:    'success',
        title:   'Data Updated',
        message: 'User information updated successfully.',
      });

      toggleEdit();
      void loadProfile();
    } else {
      setPopUp({
        kind:    'message',
        type:    'error',
        title:   'Update Error',
        message: 'Failed to save user changes to the database.',
      });
    }
  }, [loadProfile, newEmail, newName, newPassword, toggleEdit, userId]);

  const removeAccount = useCallback(async () => {
    const response = await userApi.delete(userId);

    if(response.message.toLowerCase().includes('success')) {
      notify('Account deleted successfully. Redirecting to home...', 'success');
      logout();
    } else {
      notify('Failed to delete your account!', 'danger');
    }

  }, [logout, notify, userId]);

  const uploadPhoto = useCallback(async (file: File) => {
    if(!file.type.startsWith('image/')) {
      setPopUp({
        kind:    'message',
        type:    'error',
        title:   'Invalid File',
        message: 'Please select an image.',
      });

      return;
    }

    if(file.size > 5 * 1024 * 1024) {
      setPopUp({
        kind:    'message',
        type:    'error',
        title:   'Upload Error',
        message: 'Please choose a smaller image.',
      });

      return;
    }

    try {
      const response = await userApi.uploadPhoto(userId, file);

      if(response.data?.profileImage) {
        setProfileImage(response.data.profileImage);
        localStorage.setItem('userPhoto', response.data.profileImage);

        setPopUp({
          kind:    'message',
          type:    'success',
          title:   'Update Successful',
          message: 'Image saved successfully!',
        });
      } else {
        setPopUp({
          kind:    'message',
          type:    'error',
          title:   'Save Error',
          message: 'Failed to upload image to the database.',
        });
      }
    } catch {
      setPopUp({
        kind:    'message',
        type:    'error',
        title:   'Processing Error',
        message: 'Please try again later.',
      });
    }
  }, [userId]);

  const handleConfirmAction = useCallback((action: 'edit' | 'logout' | 'delete') => {
    closePopUp();

    if(action === 'edit')   void saveChanges();
    if(action === 'logout') logout();
    if(action === 'delete') void removeAccount();

  }, [closePopUp, logout, removeAccount, saveChanges]);

  return {
    profile,
    profileImage,
    isLoading,
    isEditing,
    settingsOpen,
    selectedTheme,
    setSelectedTheme,
    popUp,
    setPopUp,
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
    loadProfile,
    uploadPhoto,
    openSettings,
    closeSettings,
    handleConfirmAction,
  };
};
