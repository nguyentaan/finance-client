// Layouts
// import { HeaderOnly } from '~/components/Layout';
import DefaultLayout from '~/components/Layout/DefautLayout';

// Pages
import Home from '~/pages/Home/Home';
import Login from '~/pages/Login/Login';
import Register from '~/pages/Register/Register';

// Public routes
const publicRoutes = [
    { path: '/dashboard', component: Home, layout: DefaultLayout },
    { path: '/', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
