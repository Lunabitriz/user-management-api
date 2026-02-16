import florestCoverLg     from '../assets/imgs/florest-cover-imgs/florest-cover-5.png';
import florestCoverMd     from '../assets/imgs/florest-cover-imgs/florest-cover-md.png';
import florestCoverMobile from '../assets/imgs/florest-cover-imgs/florest-cover-mobile.png';

const LoginPage = () => {
    return (
        <div id="main-container" className="flex justify-between items-center relative w-full rounded-3xl overflow-hidden bg-white m-0">
            <div id="auth-forms" className="w-full p-3">
                {/* Start: Login Form */}
                <div id="login-container" className="active">
                    <div className="header-form text-center">
                        <h2 className="font-bold mb-3" style={{ fontSize: '2.5rem' }}>
                            Login
                        </h2>
                        <p className="mb-0">
                            Please enter your login details in log in.
                        </p>
                    </div>
                
                    <div className="flex flex-col gap-6">
                        {/* Form inputs will appear here */}
                        <div id="login-inputs-container" className="flex flex-col gap-6 w-full"></div>
                        
                        <div className="more-actions flex justify-between">
                            <div className="remember-me-container flex" style={{ gap: '5px' }}>
                                <input id="remember-me" type="checkbox" />
                                <label htmlFor="remember-me" id="remember-me-label">Remember-me</label>
                            </div>
                            <button id="forgot-password">
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    <button id="submit-login" className="mb-2">
                        Login
                    </button>

                    <div className="toggle-form-text flex justify-center gap-2">
                        <p className="mb-0">
                            Don’t have an account?
                        </p>
                        <button id="register-toggle-btn" className="btn-auth-form">
                            Sign up
                        </button>
                    </div>
                </div> {/* end: Login Form */}
                
                {/* Registration Form */}
                <div id="register-container" className="hidden">
                    <div className="header-form text-center">
                        <h2 className="font-bold mb-3" style={{ fontSize: '2.5rem' }}>Register</h2>
                        <p className="mb-0">
                            Create your account to get started!
                        </p>
                    </div>
                    
                    <div id="register-inputs-container" className="flex flex-col gap-6"></div>

                    <button id="submit-register" className="m-0">
                        Create Account
                    </button>

                    <div className="toggle-form-text flex justify-center gap-1">
                        <p className="mb-0">Already have an account?</p>

                        <button id="login-toggle-btn" className="btn-auth-form">
                            Log in
                        </button>
                    </div>
                </div>
            </div> {/* End: Registration Form */}

            {/* Cover Images */}
            <div id="cover-img">
                <img id="florest-cover-lg"     src={florestCoverLg}     alt="florest" />
                <img id="florest-cover-md"     src={florestCoverMd}     alt="florest" />
                <img id="florest-cover-mobile" src={florestCoverMobile} alt="florest" />
            </div>

            {/* Pop-up container */}
            <div id="overflow" className="overflow hidden">
                <div id="pop-up-container"></div>
            </div>
        </div>
    );
}

export default LoginPage;