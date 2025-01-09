import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';

import { userLoginRequest } from '../../../requests/userRequests';
import { ShowAlert } from '../../../utils/alerts_utils';
import { writeTokens } from '../../../utils/token_utils';

import { OuterCard } from '../../OuterCard';

import { PROFILE } from '../../../utils/urls/profile';

import { HighlightedButton } from '../../buttons/HighlightedButton';
import { COLORS } from '../../Colors';


const LoginForm = () => {
	document.title = 'Вход';
	const navigate = useNavigate();
	const [ registrationData, setRegistrationData ] = useState({
        username: null,
        password: null,
        password2: null,
    })

	const handleLogin = () => {
		if (!registrationData.username || !registrationData.password) {
			ShowAlert.warning({message: 'Заполните все поля'});
			return;
		};

		userLoginRequest(registrationData)
		.then(response => {
			return response.json();
		})
		.then(data => {
            if (!(data.refresh || data.access)) {
                for (let key in data) {
                    ShowAlert.error({message: `${key}: ${data[key]}`});
                }
                return;
            }

			writeTokens({RefreshToken: data.refresh, AccessToken: data.access})
			navigate(PROFILE);
		});
	};

	return (
		<OuterCard>
			<h1 style={{textAlign: 'center'}}>Вход</h1>
			<hr/>
			<Form>
				<Form.Group controlId='formLoginUsername'>
					<Form.Label>Имя пользователя:</Form.Label>
					<Form.Control
						style={{backgroundColor: COLORS.secondary, color: COLORS.text}}
						type='text'
						onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}
					/>
				</Form.Group>

				<Form.Group controlId='formLoginPassword'>
					<Form.Label>Пароль:</Form.Label>
					<Form.Control
						style={{backgroundColor: COLORS.secondary, color: COLORS.text}}
						type='password'
						onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
					/>
				</Form.Group>

				<HighlightedButton style={{width: '100%'}} className='mt-3' onClick={handleLogin}>
					Войти
				</HighlightedButton>
			</Form>
		</OuterCard>
	);
};

export default LoginForm;
