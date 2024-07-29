/** @type {import('../types/index.js').NavigationConfig} */
const navigation = {
  topNavigation: {
    auth: {
      dashboard: {
        link: '/dashboard',
        label: 'auth.navbar.links.dashboard',
      },
      client: {
        link: '/client',
        label: 'auth.navbar.links.client',
      },
      employee: {
        link: '/employee',
        label: 'auth.navbar.links.employee',
      },
      finance: {
        link: '/finance',
        label: 'auth.navbar.links.finance',
      },
      subscription: {
        link: '/finance',
        label: 'auth.navbar.links.subscription',
      },
    },
    root: {
      signIn: {
        link: '/signin',
        label: 'root.navbar.links.signin',
      },
      signUp: {
        link: '/signup',
        label: 'root.navbar.links.signup',
      },
    },
  },
  sideNavigation: {
    auth: {
      dashboard: {},
      client: {},
      employee: {},
      finance: {},
      subscription: {},
    },
    root: {
      signIn: {},
      signUp: {},
    },
  },
};

export default navigation;
