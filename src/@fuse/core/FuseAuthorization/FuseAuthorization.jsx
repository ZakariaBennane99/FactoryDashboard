import { Component } from 'react';
import { matchRoutes } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import withRouter from '@fuse/core/withRouter';
import history from '@history';
import { getSessionRedirectUrl, resetSessionRedirectUrl, setSessionRedirectUrl } from '@fuse/core/FuseAuthorization/sessionRedirectUrl';
import FuseLoading from '@fuse/core/FuseLoading';

function isUserGuest(role) {
    return !role || (Array.isArray(role) && role.length === 0);
}

class FuseAuthorization extends Component {
    constructor(props, context) {
        super(props);

        const { routes } = context;

        this.state = {
            accessGranted: true,
            routes
        };
    }

    componentDidMount() {
        const { accessGranted } = this.state;

        if (!accessGranted) {
            this.redirectRoute();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { accessGranted } = this.state;

        return nextState.accessGranted !== accessGranted;
    }

    componentDidUpdate() {
        const { accessGranted } = this.state;

        if (!accessGranted) {
            this.redirectRoute();
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { location, userRole } = props;
        const { pathname } = location;
        const matchedRoutes = matchRoutes(state.routes, pathname);
        const matched = matchedRoutes ? matchedRoutes[0] : false;

        const isGuest = isUserGuest(userRole);

        if (!matched) {
            return { accessGranted: true };
        }

        const { route } = matched;

        const userHasPermission = FuseUtils.hasPermission(route.auth, userRole);

        const ignoredPaths = ['/', '/callback', '/sign-in', '/sign-out', '/logout', '/404'];

        if (matched && !userHasPermission && !ignoredPaths.includes(pathname)) {
            setSessionRedirectUrl(pathname);
        }

        if (!userHasPermission && !isGuest && !ignoredPaths.includes(pathname)) {
            setSessionRedirectUrl('/');
        }

        return {
            accessGranted: matched ? userHasPermission : true
        };
    }

    redirectRoute() {
        const { userRole, loginRedirectUrl } = this.props;
        const redirectUrl = getSessionRedirectUrl() || loginRedirectUrl;

        if (!userRole || userRole.length === 0) {
            setTimeout(() => history.push('/sign-in'), 0);
        } else {
            setTimeout(() => history.push(redirectUrl), 0);
            resetSessionRedirectUrl();
        }
    }

    render() {
        const { accessGranted } = this.state;
        const { children } = this.props;

        return accessGranted ? children : <FuseLoading />;
    }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorization);
