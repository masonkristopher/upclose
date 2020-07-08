// import express from 'express';
// import passport from 'passport';
// import dotenv from 'dotenv';
// import util from 'util';
// import url from 'url';
// import querystring from 'querystring';

// const authRouter = express.Router();

// dotenv.config();

// // perfroms the login, then redirects to callback
// authRouter.get('/login', passport.authenticate('auth0', {
//   scope: 'openid email profile',
// }), (req, res) => {
//   res.redirect('/');
// });

// // perform the final stage of authentication and redirect to previously requested URL or /user
// authRouter.get('/callback', (req, res, next) => {
//   passport.authenticate('auth0', (err, user, info) => {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.login(user, (err) => {
//       if (err) { return next(err); }
//       const { returnTo } = req.session;
//       delete req.session.returnTo;
//       res.redirect(returnTo || '/user');
//     });
//   })(req, res, next);
// });

// authRouter.get('/logout', (req, res) => {
//   req.logout();

//   let returnTo = req.protocol + '://' + req.hostname;
//   const port = req.connection.localPort;
//   if (port !== undefined && port !== 80 && port !== 443) {
//     returnTo += ':' + port;
//   }
//   const logoutURL = new url.URL(
//     util.format('https://%s/v2/logout', process.env.AUTH_DOMAIN),
//   );
//   const searchString = querystring.stringify({
//     client_id: process.env.AUTH0_CLIENT_ID,
//     returnTo,
//   });
//   logoutURL.search = searchString;

//   res.redirect(logoutURL);
// });
