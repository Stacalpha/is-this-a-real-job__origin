import { signin, signup } from '../controllers/authController';
import {
  validateSigninFormData,
  validateSignupFormData,
  validateCommentData,
  validUser,
  validateInvite,
  validateInviteId,
  validateInviteData,
  validateInviteUpdateData,
  authenticateUserToken,
  validateAdmin,
  validateUserById,
  validateUserId,
  validateUpvoteInput,
  validateInviteOwner,
  twitterAuthCallback,
  twitterAuthenticate,
  googleAuthenticate,
  googleAuthCallback,
  facebookAuthenticate,
  facebookAuthCallback,
  multerUploads,
  verifyUniqueUserUsername,
  verifyUniqueUserEmail
} from '../middlewares/middlewares';

import {
  deleteInvite,
  saveNewInvite,
  getOneInvite,
  getAllInvites,
  updateInvite,
  renderSinglePostPage,
  renderJobInvitesPage,
  renderSearchResults,
  searchInvitesApi,
  renderEditInvitePage,
  renderAdminJobInvitesPage,
  upvoteInvite,
  downvoteInvite,
  unvoteInvite,
  fetchVoteCount
} from '../controllers/inviteController';

import { getComments, createComment } from '../controllers/commentController';
import {
  blockUser,
  getUsers,
  renderAdminUsersPage,
  getUser,
  renderUserProfile,
  getUserByUserId,
  renderAdminReportedUsersPage,
  checkRenderIsAdmin
} from '../controllers/userController';
import {
  getNotifications,
  createNotification
} from '../controllers/notificationController';
import { validateNotificationData } from '../middlewares/validateNotification';
import {
  validateCookies,
  signUserIn,
  signUserOut
} from '../middlewares/cookieHandler';
import { getMetrics } from '../controllers/metricsController';

import { descriptions } from '../helpers/metatags';

const genericDescription = 'Our app helps you check if job opportunities are real or not.';

export const initRoutes = app => {
  // Cookie handlers before all
  app.use(validateCookies);
  app.use(signUserIn);
  app.use(signUserOut);

  // All EJS frontend endpoints below --------------------------------------------------

  app.get('/', (req, res) => res.render('index', { isAuth: req.isAuth, isAdmin: req.auth.isAdmin, meta: { title: 'Is This A Real Job', description: genericDescription } })); // Pass true or false to toggle state of navbar....
  app.get('/login', (req, res) => res.render('login', { isAuth: req.isAuth, isAdmin: req.auth.isAdmi, meta: { title: 'Login - Is This A Real Job', description: genericDescription } }));
  app.get('/register', (req, res) => res.render('register', { isAuth: req.isAuth, isAdmin: req.auth.isAdmin, meta: { title: 'Register - Is This A Real Job', description: descriptions.register } }));
  app.get('/post', getUserByUserId, (req, res) => res.render('userPost', {
    isAuth: req.isAuth,
    isAdmin: req.auth.isAdmin,
    user: req.user,
    username: req.auth.username,
    name: req.auth.name,
    meta: { title: 'New Post - Is This A Real Job', descripiton: genericDescription }
  }));
  app.get('/howitworks', (req, res) => res.render('howitworks', { isAuth: req.isAuth, isAdmin: req.auth.isAdmi, meta: { title: 'How It Works - Is This A Real Job', description: genericDescription } }));
  app.get('/reportuser', getUserByUserId, (req, res) => res.render('reportuser', { isAuth: req.isAuth, isAdmin: req.auth.isAdmin, meta: { title: 'Report User - Is This A Real Job', description: genericDescription } }));
  app.get('/posts', renderJobInvitesPage);
  app.get('/post/:inviteId', renderSinglePostPage);
  app.get('/about', (req, res) => res.render('about', {
    isAuth: req.isAuth,
    isAdmin: req.auth.isAdmin,
    username: req.auth.username,
    name: req.auth.name,
    meta: { title: 'About - Is This A Real Job', description: genericDescription }
  }));
  app.get('/admin/reported', checkRenderIsAdmin, (req, res) => res.render('admin/reportedUsers', {
    isAuth: req.auth.isAuth,
    isAdmin: req.auth.isAdmin,
    meta: { title: 'Reported Users - Is This A Real Job', description: genericDescription }
  }));
  app.get('/reportUser', (req, res) => res.render('reportUser', {
    isAuth: false,
    username: req.auth.username,
    name: req.auth.name,
    isAdmin: req.auth.isAdmin,
    meta: { title: 'Report User - Is This A Real Job', description: genericDescription }
  }));
  app.get('/users/:username', renderUserProfile);
  app.get('/admin/reportedusers', checkRenderIsAdmin, renderAdminReportedUsersPage);
  // Search Invites - Renders view
  app.get('/invites/search', renderSearchResults);
  app.get('/admin', checkRenderIsAdmin, (req, res) => res.render('./admin/index', {
    isAuth: req.isAuth,
    username: req.auth.username,
    name: req.auth.name,
    isAdmin: req.auth.isAdmin,
    meta: { title: 'Admin Home - Is This A Real Job', description: genericDescription }
  }));


  // Edit post endpoint
  app.get(
    '/post/:inviteId/edit',
    validateInviteId,
    validateInvite,
    getUserByUserId,
    renderEditInvitePage
  );

  app.get('/admin/users', checkRenderIsAdmin, renderAdminUsersPage);
  app.get('/admin/posts', checkRenderIsAdmin, renderAdminJobInvitesPage);

  // All backend API endpoints below -----------------------------------------------------
  // Auth
  app.post('/api/v1/auth/signin', validateSigninFormData, validUser, signin);
  app.post(
    '/api/v1/auth/signup',
    validateSignupFormData,
    verifyUniqueUserEmail,
    verifyUniqueUserUsername,
    signup
  );


  // Twitter Auth
  app.get('/auth/twitter', twitterAuthenticate);
  app.get('/auth/twitter/redirect', twitterAuthCallback);

  // Google Auth
  app.get('/auth/google', googleAuthenticate);
  app.get('/auth/google/redirect', googleAuthCallback);

  // Facebook Auth
  app.get('/auth/facebook', facebookAuthenticate);
  app.get('/auth/facebook/redirect', facebookAuthCallback);


  // Get all Users
  app.get('/api/v1/users', authenticateUserToken, validateAdmin, getUsers);

  // Get single User - return JSON
  app.get('/api/v1/users/json/:username', getUser);


  // Block a user
  app.patch(
    '/api/v1/users/block/:userId',
    validateUserId,
    authenticateUserToken,
    validateAdmin,
    validateUserById,
    blockUser
  );

  // Post a new job invite.
  app.post(
    '/api/v1/invites',
    authenticateUserToken,
    multerUploads,
    validateInviteData,
    saveNewInvite
  );

  // Get all job invites in the database.
  app.get('/api/v1/invites', getAllInvites);

  // Search Invites - Returns JSON payload
  app.get('/api/v1/invites/search/json', searchInvitesApi);

  // Get a single job invite.
  app.get('/api/v1/invites/:inviteId', validateInviteId, getOneInvite);

  // Update an existing job invite.
  app.put(
    '/api/v1/invites/:inviteId',
    validateInviteUpdateData,
    validateInviteId,
    authenticateUserToken,
    validateInvite,
    validateInviteOwner,
    updateInvite
  );

  // Delete an existing job invite.
  app.delete(
    '/api/v1/invites/:inviteId',
    validateInviteId,
    authenticateUserToken,
    validateAdmin,
    validateInvite,
    deleteInvite
  );

  // Get all comments for a given Invite.
  app.get('/api/v1/comments/:inviteId', validateInviteId, getComments);

  // Post a comment on a specific Invite.
  app.post(
    '/api/v1/comments/:inviteId',
    validateCommentData,
    validateInviteId,
    authenticateUserToken,
    validateInvite,
    createComment
  );

  // New Upvote stuff
  app.get(
    '/api/v1/invites/:inviteId/votes',
    validateInviteId,
    validateInvite,
    fetchVoteCount
  );

  app.patch(
    '/api/v1/invites/:inviteId/upvote',
    authenticateUserToken,
    validateInviteId,
    validateInvite,
    upvoteInvite
  );

  app.patch(
    '/api/v1/invites/:inviteId/downvote',
    authenticateUserToken,
    validateInviteId,
    validateInvite,
    downvoteInvite
  );

  app.delete(
    '/api/v1/invites/:inviteId/vote',
    authenticateUserToken,
    validateInviteId,
    validateInvite,
    unvoteInvite
  );

  // Get the number of users, invites and comments in the database.
  app.get('/api/v1/metrics', getMetrics);

  // Get all notifications for a given user.
  app.get('/api/v1/notifications', authenticateUserToken, getNotifications);
  app.post('/api/v1/notifications', validateNotificationData, createNotification);
  app.get('/api/v1/notifications/:userId', validateUserId, getNotifications);

  // Fallback case for unknown URIs.
  app.get('/notAuthorized', (req, res) => res.render('401', { meta: { title: '404 - Page Not Found', description: genericDescription } }));
  app.get('/forbiden', (req, res) => res.render('403', { meta: { title: '403 - Forbidden Route', description: genericDescription } }));
  app.all('*', (req, res) => res.render('404', { meta: { title: '404 - Page Not Found', description: genericDescription } }));
};
