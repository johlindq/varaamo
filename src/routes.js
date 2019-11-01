import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Route from '../app/shared/route';
import PrivateRoute from '../app/shared/private-route';
import AppContainer from '../app/pages/AppContainer';
import AboutPage from '../app/pages/about';
import AdminResourcesPage from '../app/pages/admin-resources';
import HomePage from '../app/pages/home';
import NotFoundPage from '../app/pages/not-found';
import ReservationPage from '../app/pages/reservation';
import ResourcePage from '../app/pages/resource';
import SearchPage from '../app/pages/search';
import UserReservationsPage from '../app/pages/user-reservations';
import FavoritesPage from '../app/pages/favorites/favoritesPage';
import LoginCallback from '../app/pages/auth/LoginCallback';
import LogoutCallback from '../app/pages/auth/LogoutCallback';
import AccessibilityInfoPage from '../app/pages/accessibility-info';

export default () => (
  <AppContainer>
    <Switch>
      <Route component={HomePage} componentName="Home" exact path="/" />
      <Route component={SearchPage} componentName="Search" path="/search" />
      <Route component={AboutPage} componentName="About" path="/about" />
      <Route component={ResourcePage} componentName="Resource" path="/resources/:id" />
      <Route component={AccessibilityInfoPage} componentName="Seloste" path="/accessibility-info" />

      <Route component={LoginCallback} componentName="LoginCallback" path="/callback" />
      <Route component={LogoutCallback} componentName="LogoutCallback" path="/logout/callback" />

      <PrivateRoute
        component={AdminResourcesPage}
        componentName="AdminResources"
        path="/admin-resources"
      />
      <PrivateRoute
        component={FavoritesPage}
        componentName="Favorites"
        path="/favourites"
      />
      <PrivateRoute
        component={UserReservationsPage}
        componentName="MyReservations"
        path="/my-reservations"
      />
      <PrivateRoute component={ReservationPage} componentName="Reservation" path="/reservation" />

      <Redirect from="/home" to="/" />
      <Redirect from="/resources/:id/reservation" to="/resources/:id" />
      <Route component={NotFoundPage} componentName="NotFoundPage" path="*" />
    </Switch>
  </AppContainer>
);
