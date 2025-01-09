import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';

import { userRegistrationRequest } from '../../../requests/userRequests';
import { ShowAlert } from '../../../utils/alerts_utils';
import { writeTokens } from '../../../utils/token_utils';

import { OuterCard } from '../../OuterCard';
import { HighlightedButton } from '../../buttons/HighlightedButton';

import { PROFILE } from '../../../utils/urls/profile';

import { COLORS } from '../../Colors';


const RegistrationForm = () => {
	document.title = 'Регистрация';
	const navigate = useNavigate();
    const [ registrationData, setRegistrationData ] = useState({
        username: null,
        password: null,
        confirm_password: null,
		email: null,
    })

	const handleRegistration = () => {
		if (!registrationData.username || !registrationData.password || !registrationData.confirm_password || !registrationData.email) {
			ShowAlert.warning({message: 'Заполните все поля'});
			return;
		};

        if (registrationData.password !== registrationData.confirm_password) {
            ShowAlert.warning({message: 'Пароли не совпадают'});
			return;
        };

		userRegistrationRequest(registrationData)
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
			<h1 style={{textAlign: 'center'}}>Регистрация</h1>
			<hr/>
			<Form>
				<Form.Group controlId='formRegisterUsername'>
					<Form.Label>Имя пользователя:</Form.Label>
					<Form.Control
						style={{backgroundColor: COLORS.secondary, color: COLORS.text}}
						required
						type='text'
						onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}
					/>
				</Form.Group>

				<Form.Group controlId='formRegisterEmail'>
					<Form.Label>Почта:</Form.Label>
					<Form.Control
						style={{backgroundColor: COLORS.secondary, color: COLORS.text}}
						required
						type='email'
						onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
					/>
				</Form.Group>

				<Form.Group controlId='formRegisterPassword'>
					<Form.Label>Пароль:</Form.Label>
					<Form.Control
						style={{backgroundColor: COLORS.secondary, color: COLORS.text}}
						required
						type='password'
						onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
					/>
				</Form.Group>

                <Form.Group controlId='formRegisterConfirmPassword'>
					<Form.Label>Подтверждение пароля:</Form.Label>
					<Form.Control
						style={{backgroundColor: COLORS.secondary, color: COLORS.text}}
						required
						type='password'
						onChange={(e) => setRegistrationData({...registrationData, confirm_password: e.target.value})}
					/>
				</Form.Group>

				<HighlightedButton style={{width: '100%'}} className='mt-3' onClick={handleRegistration}>
					Зарегистрироваться
				</HighlightedButton>
			</Form>
		</OuterCard>
	);
};

export default RegistrationForm;
