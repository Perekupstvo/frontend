import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import RegistrationForm from '../../components/forms/authentication/RegistrationForm';
import LoginForm from '../../components/forms/authentication/LoginForm';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';


const AuthenticationPage = () => {
	const [isLoginMode, setIsLoginMode] = useState(false);

	const handleToggleMode = () => {
		setIsLoginMode(!isLoginMode);
	};

  	return (
		<Container className="mt-5">
			<Row className="justify-content-center">
				<Col md={6}>
					{isLoginMode ? (
						<LoginForm />
					) : (
						<RegistrationForm />
					)}
					<PrimaryButton onClick={handleToggleMode} className="mt-2">
						{isLoginMode ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}
					</PrimaryButton>
				</Col>
			</Row>
		</Container>
	);
};

export default AuthenticationPage;