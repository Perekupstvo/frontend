import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PageTemplate from '../views/index';
import AuthenticationPage from '../views/authentication/authenticationPage';
import MyProfilePage from '../views/profile/myProfilePage';
import OwnCarsPage from '../views/cars/own/index';
import OwnCarsCreatePage from '../views/cars/own/create';
import OwnCarsViewPage from '../views/cars/own/view';
import OwnCarsStatisticPage from '../views/cars/own/statistic';

import { PROFILE } from '../utils/urls/profile';
import { MYCARS, MYCARS_CREATE, MYCARS_VIEW, STATISTIC } from '../utils/urls/cars';

export const AuthenticationRoutePath = '/authentication';


const AppRouter = () => {
	return (
		<Router>
			<Routes>
				<Route path="*" element={
					<PageTemplate >
                        <div></div>
					</PageTemplate>
				} />

				<Route path={AuthenticationRoutePath} element={
					<PageTemplate show_navbar={false} check_token={false} >
						<AuthenticationPage />
					</PageTemplate>
				} />

				<Route path={PROFILE} element={
					<PageTemplate >
						<MyProfilePage />
					</PageTemplate>
				} />

				<Route path={MYCARS} element={
					<PageTemplate >
						<OwnCarsPage />
					</PageTemplate>
				} />
				<Route path={MYCARS_CREATE} element={
					<PageTemplate >
						<OwnCarsCreatePage />
					</PageTemplate>
				} />
				<Route path={MYCARS_VIEW} element={
					<PageTemplate >
						<OwnCarsViewPage />
					</PageTemplate>
				} />
				<Route path={STATISTIC} element={
					<PageTemplate >
						<OwnCarsStatisticPage />
					</PageTemplate>
				} />
			</Routes>
		</Router>
	);
};

export default AppRouter;