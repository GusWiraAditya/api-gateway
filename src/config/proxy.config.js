export default [
  {
    path: '/api/users',
    target: process.env.USER_SERVICE_URL+'/api/users',
    auth: true,
    secret: process.env.USER_SECRET_KEY
  },
  {
    path: '/api/complaints',
    target: process.env.USER_SERVICE_URL+'/api/complaints',
    auth: true,
    secret: process.env.USER_SECRET_KEY
  },
  {
    path: '/api/feedbacks',
    target: process.env.USER_SERVICE_URL+'/api/feedbacks',
    auth: true,
    secret: process.env.USER_SECRET_KEY
  },
  {
    path: '/api/layanan',
    target: process.env.LAYANAN_SERVICE_URL+'/api/layanan',
    auth: true,
    secret: process.env.LAYANAN_SECRET_KEY
  },
  {
    path: '/api/auth',
    target: process.env.AUTH_SERVICE_URL + '/api/auth',
    auth: false,
    secret: process.env.AUTH_SECRET_KEY
  },
  {
    path: '/api/admin',
    target: process.env.AUTH_SERVICE_URL + '/api/admin',
    auth: false,
    secret: process.env.ADMIN_SECRET_KEY
  },
  {
    path: '/api/credentials',
    target: process.env.AUTH_SERVICE_URL + '/api/credentials',
    auth: false,
    secret: process.env.AUTH_SECRET_KEY
  },
  {
    path: '/api/profile-picture',
    target: process.env.AUTH_SERVICE_URL + '/api/profile-picture',
    auth: false,
    secret: process.env.AUTH_SECRET_KEY
  }
];