export default [
  {
    path: '/api/users',
    target: process.env.USER_SERVICE_URL+'/api/users',
    auth: true,
  },
  {
    path: '/api/complaints',
    target: process.env.USER_SERVICE_URL+'/api/complaints',
    auth: true,
  },
  {
    path: '/api/feedbacks',
    target: process.env.USER_SERVICE_URL+'/api/feedbacks',
    auth: true,
  },
  {
    path: '/api/layanan',
    target: process.env.LAYANAN_SERVICE_URL+'/api/layanan',
    auth: true,
  },
  {
    path: '/api/auth',
    target: process.env.AUTH_SERVICE_URL + '/api/auth',
    auth: false,
  },
  {
    path: '/api/admin',
    target: process.env.AUTH_SERVICE_URL + '/api/admin',
    auth: false,
  },
  {
    path: '/api/credentials',
    target: process.env.AUTH_SERVICE_URL + '/api/credentials',
    auth: false,
  },
  {
    path: '/api/profile-picture',
    target: process.env.AUTH_SERVICE_URL + '/api/profile-picture',
    auth: false,
  }
];