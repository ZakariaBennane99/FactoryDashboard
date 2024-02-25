import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/user/userSlice';
import { useAppDispatch } from 'app/store';
import jwtService from './services/jwtService';

const AuthContext = React.createContext({});

function AuthProvider(props) {
    const { children } = props;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [waitAuthCheck, setWaitAuthCheck] = useState(true);
    const dispatch = useAppDispatch();
    const val = useMemo(() => ({ isAuthenticated }), [isAuthenticated]);

    useEffect(() => {
        const handleAutoLogin = () => {
            setIsAuthenticated(true);
            setWaitAuthCheck(false);
        };

        const handleLogin = (user) => {
            dispatch(setUser(user));
            dispatch(showMessage({ message: 'Signed in' }));
            setIsAuthenticated(true);
            setWaitAuthCheck(false);
        };

        const handleLogout = () => {
            dispatch(logoutUser());
            dispatch(showMessage({ message: 'Signed out' }));
            setIsAuthenticated(false);
            setWaitAuthCheck(false);
        };

        const handleNoAccessToken = () => {
            setIsAuthenticated(false);
            setWaitAuthCheck(false);
        };

        jwtService.on('onAutoLogin', handleAutoLogin);
        jwtService.on('onLogin', handleLogin);
        jwtService.on('onLogout', handleLogout);
        jwtService.on('onAutoLogout', handleLogout);
        jwtService.on('onNoAccessToken', handleNoAccessToken);

        jwtService.init();

        // Cleanup event listeners on component unmount
        return () => {
            jwtService.off('onAutoLogin', handleAutoLogin);
            jwtService.off('onLogin', handleLogin);
            jwtService.off('onLogout', handleLogout);
            jwtService.off('onAutoLogout', handleLogout);
            jwtService.off('onNoAccessToken', handleNoAccessToken);
        };
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