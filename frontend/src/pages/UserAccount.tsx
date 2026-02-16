import profileImgDefault from '../assets/imgs/profile-img-default.jpg';

const UserAccount = () => {
    return (
        <div>
            <div id="overflow"></div>
        
            {/* Profile Card Container */}
            <div id="container" className="w-full mx-auto p-12 relative overflow-hidden rounded-2xl">
                <div id="bg-card-img" className="w-full absolute"></div>
                
                <div id="profile-display">
                    <div className="profile-grid grid mb-6">
                        <div className="flex flex-col justify-center gap-2 fade-in">
                            <label 
                              htmlFor="select-file-input" 
                              className="img-perfil flex justify-center items-center mx-auto rounded-full relative"
                            >
                                <img src={profileImgDefault}
                                     alt="Perfil sem foto" id="profile-image" className="rounded-full" />
        
                                <p id="change-img-msg" className="text-center absolute w-full p-4 rounded">
                                    Change profile picture
                                </p>
                            </label>
        
                            <input id="select-file-input" type="file" accept="image/*" style={{ display: 'none' }} />
        
                            <h3 
                              id="account-name" 
                              className="text-center font-medium leading-tight mt-0 mb-2" 
                              style={{ fontSize: 'calc(1.3rem + 0.6vw)' }}
                            >
                                ---
                            </h3>
                        </div>
                    
                        <div id="bio-descryption" className="flex flex-col gap-4 w-full p-4 rounded-md fade-in">
                            <div className="bio-item">
                                <p>Username:</p>
                                <h5 id="name-profile" className="profile-info"></h5>
        
                                <div className="input-item relative">
                                    <div id="user-name-error" className="edit-input-error"></div>
                                    <input 
                                        type="text" 
                                        id="new-name" 
                                        className="edit-input"
                                        autoComplete="off"
                                        placeholder="New Username"
                                    />
                                </div>
                            </div>                    
                            <div className="bio-item">
                                <p>E-mail:</p>
                                <h5 id="email-profile" className="profile-info"></h5>
        
                                <div className="input-item relative">
                                    <div id="email-error" className="edit-input-error"></div>
                                    <input
                                        type="text"
                                        id="new-email"
                                        name="email"
                                        className="edit-input"
                                        autoComplete="email"
                                        placeholder="New Email"
                                    />
                                </div>
                            </div>        
                                        
                            <div className="bio-item relative">
                                <p>Password:</p>
                                <div className="flex items-center gap-1">
                                    <h5 id="password-profile" className="profile-info" style={{ marginBottom: 0 }}></h5>
                                </div>
                                
                                <div id="new-password-container" className="input-item relative">
                                    <div id="password-message" className="edit-input-error"></div>
                                    <input
                                        type="password"
                                        id="new-password"
                                        autoComplete="off"
                                        className="edit-input"
                                        placeholder="Digite sua nova senha" 
                                    />            
                                    <label 
                                        id="new-password-label" 
                                        className="password-label absolute bg-neutral-900" 
                                        style={{ display: 'none', top: '2px', right: '8px' }}
                                    ></label>   
                                </div>
                                <div id="profile-edit-password-validations"></div>
                            </div>
                        </div>
                    </div>
        
                    <div className="profile-actions">
                        <div id="account-options" className="flex flex-col gap-4 active">
                            <div id="row-buttons" className="flex justify-between gap-4">
                                <button id="edit-profile-btn" className="fade-in btn">
                                    Edit Profile
                                </button>
                                <button id="open-settings-btn" className="fade-in btn">
                                    Settings
                                </button>
                            </div>
        
                            <button id="logout-btn" className="fade-in-medium btn">
                                Logout
                            </button>
                        </div>
        
                        <div id="edit-options" className="flex flex-col gap-4">
                            <button id="save-changes-btn" className="edit-btn fade-in btn">
                                Save Changes
                            </button>
                            <button id="cancel-edit-btn" className="fade-in btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div> {/* End: Profile Card Container */}
        
            {/* Modal Settings */}
            <div id="settings" className="w-full p-12 rounded-2xl relative">
                <button 
                  id="close-settings" 
                  className="absolute text-xl p-0" 
                  style={{ top: '1rem', right: '1rem' }}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
        
                {/* Themes section */}
                <div id="themes-section" className="themes-grid"></div>
        
                {/* Delete account section */}
                <div id="account-settings" className="mt-12">
                    <div className="header-settings">
                        <h3 
                          className="font-medium leading-tight mt-0 mb-2" 
                          style={{ fontSize: 'calc(1.3rem + 0.6vw)' }}
                        >
                            Account
                        </h3>
                        <p className="mb-4">
                            Deleting your account will erase all your data permanently. Are you sure about this?
                        </p>
                    </div>
                    
                    <button id="remove-account-btn" className="fade-in btn">
                        Delete Account
                    </button>
                </div>
            </div> {/* End: Modal Settings */}
        
            <div id="pop-up-container" style={{ position: 'absolute', zIndex: 1000 }}></div>
        </div>
    );
}

export default UserAccount;