import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/user/userSlice';
import { useAppDispatch } from 'app/store';
import jwtService from './services/jwtService';

/**
 * The AuthContext object is a React context object that provides authentication information to child components.
 */
const AuthContext = React.createContext({});

/**
 * The AuthProvider component is a wrapper component that provides authentication information to child components.
 */
function AuthProvider(props) {
    const { children } = props;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [waitAuthCheck, setWaitAuthCheck] = useState(true);
    const dispatch = useAppDispatch();
    const val = useMemo(() => ({ isAuthenticated }), [isAuthenticated]);

    useEffect(() => {
        jwtService.on('onAutoLogin', () => {
            dispatch(showMessage({ message: 'Signing in!' }));

            /**
             * Sign in and retrieve user data with stored token
             */
            jwtService
                .signInWithToken()
                .then((user) => {
                    success(user, 'You have signed in!');
                })
                .catch((error) => {
                    pass(error.message);
                });
        });

        jwtService.on('onLogin', (user) => {
            success(user, 'Signed in');
        });

        jwtService.on('onLogout', () => {
            pass('Signed out');

            dispatch(logoutUser());
        });

        jwtService.on('onAutoLogout', (message) => {
            pass(message);

            dispatch(logoutUser());
        });

        jwtService.on('onNoAccessToken', () => {
            pass();
        });

        jwtService.init();

        function success(user, message) {
            Promise.all([
                dispatch(setUser(user))
                // You can receive data in here before app initialization
            ]).then(() => {
                if (message) {
                    dispatch(showMessage({ message }));
                }

                setWaitAuthCheck(false);
                setIsAuthenticated(true);
            });
        }

        function pass(message) {
            if (message) {
                dispatch(showMessage({ message }));
            }

            setWaitAuthCheck(false);
            setIsAuthenticated(false);
        }
    }, [dispatch]);

    return waitAuthCheck ? <FuseSplashScreen /> : <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
}

function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}

export { useAuth, AuthProvider };