import { useState } from 'react';

import lockIcon from '../assets/imgs/lock.png';
import userIcon from '../assets/imgs/user.png';
import emailArt from '../assets/imgs/pop-ups-arts/email-art.jpg';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);

    return (
        <div>
            {/* Step 1: Enter Email */}
            {step === 1 && (
                <div id="enter-email-container" className="forgot-container bg-white rounded-2xl flex-col items-center justify-center gap-2 p-12 relative flex" style={{ width: '389px' }}>
                    <div className="email-ilustration">
                        <img src={emailArt} alt="Email image" width="193px" />
                    </div>

                    <div className="header-form text-center">
                        <h3>Forgot Password?</h3>
                        <p className="mb-0">
                            Please enter your email to reset your password.
                        </p>
                    </div>
                
                    <div className="input-item my-4 flex flex-col w-full relative">
                        <div id="email-error" className="input-error"></div>
                        <input 
                            type="text" 
                            id="recovery-email" 
                            className="input-login"
                            placeholder="Your email"
                        />
                        <img className="input-icon" src={userIcon} alt="User icon" />
                    </div>

                    <button 
                        id="confirm-mail-btn" 
                        className="confirmation-btn mb-2"
                        onClick={() => setStep(2)}
                    >
                        Confirm Mail
                    </button>
                </div>
            )}
            
            {/* Step 2: Enter validation code */}
            {step === 2 && (
                <div 
                  id="code-container" 
                  className="forgot-container bg-white rounded-2xl flex-col items-center justify-center gap-2 p-12 flex" 
                  style={{ width: '389px' }}
                >
                    <div className="email-ilustration">
                        <img src={emailArt} alt="Email image" width="193px" />
                    </div>

                    <div className="header-form text-center">
                        <h3>Enter code</h3>
                        <p className="mb-0">
                            Verification code send to: 
                            <span id="send-to-mail" className="font-medium ml-1">example@mail.com</span>
                        </p>
                    </div>
                
                    <div id="input-item-forgot" className="mt-4 mb-1 flex flex-row w-full gap-2 justify-center">
                        <input type="text" className="w-10 h-10 border text-center rounded" maxLength={1} />
                        <input type="text" className="w-10 h-10 border text-center rounded" maxLength={1} />
                        <input type="text" className="w-10 h-10 border text-center rounded" maxLength={1} />
                        <input type="text" className="w-10 h-10 border text-center rounded" maxLength={1} />
                    </div>

                    <p>Expires in: 
                        <span id="expires-in" className="font-medium ml-1">10:00</span>
                    </p>

                    <button 
                        id="confirm-send-code-btn" 
                        className="confirmation-btn mb-2"
                        onClick={() => setStep(3)}
                    >
                        Confirm Code
                    </button>
                </div>
            )}

            {/* Step 3: New Password Container */}
            {step === 3 && (
                <div 
                  id="new-password-container" 
                  className="forgot-container bg-white rounded-2xl flex-col items-center justify-center gap-2 p-12 flex" 
                  style={{ width: '389px' }}
                >
                    <div className="email-ilustration">
                        <img src={emailArt} alt="Email image" width="193px" />
                    </div>

                    <div className="header-form text-center">
                        <h3>New Password</h3>
                        <p className="mb-0">
                            Please enter your new Password.
                        </p>
                    </div>
                
                    <div id="new-password-redefine-container" className="mt-4 flex flex-col w-full">
                        {/* New Password */}
                        <div className="input-item relative w-full mb-4">
                            <div id="password-message" className="input-error"></div>
                            <input
                                type="password"
                                id="new-password-redefine"
                                className="input-login w-full"
                                placeholder="New password"
                                autoComplete="off"
                            />
                            <img className="input-icon" src={lockIcon} alt="Lock icon" />
                        </div>

                        <label 
                            className="password-label"
                            htmlFor="new-password-redefine" 
                            id="new-password-redefine-label" 
                        ></label>

                        <div id="redefine-password-validations"></div>
                        
                        {/* Confirm Password */}
                        <div className="input-item relative w-full mb-4">
                            <div id="confirm-password-message" className="input-error"></div>
                            <input
                                type="password"
                                id="confirm-password-redefine"
                                className="input-login w-full"
                                placeholder="Confirm password"
                                autoComplete="off"
                            />
                            <img className="input-icon" src={lockIcon} alt="Lock icon" />
                        </div>
                        <label 
                            className="password-label"
                            htmlFor="confirm-password-redefine" 
                            id="confirm-password-redefine-label" 
                        ></label>
                    </div>

                    <button 
                        id="confirm-password-btn" 
                        className="confirmation-btn mb-2"
                        onClick={() => setStep(4)}
                    >
                        Confirm Password
                    </button>
                </div>
            )}

            {/* Step 4: Password Update Confirmation */}
            {step === 4 && (
                <div
                  id="confirm-container" 
                  className="forgot-container bg-white rounded-2xl flex-col items-center justify-center gap-2 p-12 flex" 
                  style={{ width: '389px' }}
                >
                    <div className="email-ilustration">
                        <img src={emailArt} alt="Email image" width="193px" />
                    </div>

                    <div className="header-form text-center mb-4">
                        <h3>Password Updated!</h3>
                        <p className="mb-0">
                            Please wait, you will be directed to the homepage
                        </p>
                    </div>

                    <button 
                        id="confirm-btn" 
                        className="confirmation-btn mb-2"
                        onClick={() => alert("Redirecionar para Home")}
                    >
                        Confirm
                    </button>
                </div>
            )}
        </div>
    );
}

export default ForgotPassword;