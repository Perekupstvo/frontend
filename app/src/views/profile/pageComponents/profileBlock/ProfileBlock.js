import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { FaPen, FaTimes } from 'react-icons/fa';

import { MyButton } from '../../../../components/buttons/MyButton';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { ShowAlert } from '../../../../utils/alerts_utils';
import { changeProfileDataRequest } from '../../../../requests/userRequests/profile';

import { COLORS } from '../../../../components/Colors';

import {PrimaryButton} from '../../../../components/buttons/PrimaryButton';


export const ProfileBlock = (
    { profileData, setProfileData }
) => {
    const [ changeMode, setChangeMode ] = useState(false)

    return (
        <Card style={{backgroundColor: COLORS.secondary, color: COLORS.text}}>
            <Card.Body>
                <Card.Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {
                            changeMode ?
                            <p>Редактирование</p>
                            : <p>Основная информация</p>
                        }
                        {
                            !changeMode ?
                            <FaPen 
                                className="mr-2"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setChangeMode(!changeMode)}
                            />
                            : <FaTimes 
                                className="mr-2"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setChangeMode(!changeMode)}
                            />
                        }
                    </div>
                </Card.Title>
                <Card.Text>
                    {
                        !changeMode ?
                        <ViewProfileBlock profileData={profileData} />
                        : <EditProfileBlock 
                            profileData={profileData}
                            setProfileData={setProfileData}
                            changeMode={changeMode}
                            setChangeMode={setChangeMode}
                        />
                    }
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

const ViewProfileBlock = ({ profileData }) => {
    return (
        <Container>
            <Row className="mb-3">
                <Form.Label column sm="3"><strong>ID:</strong></Form.Label>
                <Col sm="9">
                    <p>{profileData.id}</p>
                </Col>
            </Row>
            <Row className="mb-3">
                <Form.Label column sm="3"><strong>Username:</strong></Form.Label>
                <Col sm="9">
                    <p>{profileData.username}</p>
                </Col>
            </Row>
            <Row className="mb-3">
                <Form.Label column sm="3"><strong>Email:</strong></Form.Label>
                <Col sm="9">
                    <p>{profileData.email}</p>
                </Col>
            </Row>
            <Row className="mb-3">
                <Form.Label column sm="3"><strong>Имя:</strong></Form.Label>
                <Col sm="9">
                    <p>{profileData.first_name}</p>
                </Col>
            </Row>
            <Row className="mb-3">
                <Form.Label column sm="3"><strong>Фамилия:</strong></Form.Label>
                <Col sm="9">
                    <p>{profileData.last_name}</p>
                </Col>
            </Row>
            <Row className="mb-3">
                <Form.Label column sm="3"><strong>Отчество:</strong></Form.Label>
                <Col sm="9">
                    <p>{profileData.patronymic}</p>
                </Col>
            </Row>
            {/* <Row className="mb-3">
                <Form.Label column sm="3"><strong>Номер телефона:</strong></Form.Label>
                <Col sm="9">
                    <p>{profileData.bio.phone_number}</p>
                </Col>
            </Row> */}
            {/* <Row className="mb-3">
                <Form.Label column sm="3"><strong>Дополнительная информация:</strong></Form.Label>
                <Col sm="9">
                    <Form.Control 
                        style={{ 
                            border: "1px solid",
                            borderColor: "rgba(200, 200, 200, 0.5)",
                            padding: "5px",
                            cursor: "default",
                        }}
                        as="textarea"
                        plaintext
                        readOnly
                        defaultValue={profileData.additional_info}
                    />
                </Col>
            </Row> */}
        </Container>
    );
}

const EditProfileBlock = ({ profileData, setProfileData, changeMode, setChangeMode }) => {
    const [changedData, setChangedData] = useState({
        bio: {}
    });

    const handleSave = () => {
        let errorMessage = "";
        let profileBio = profileData;
        let changedBio = {
            email: changedData.email || profileBio.email,
            first_name: changedData.first_name || profileBio.first_name,
            last_name: changedData.last_name || profileBio.last_name,
            patronymic: changedData.patronymic || profileBio.patronymic,
            // phone_number: changedData.phone_number || profileBio.phone_number,
            // additional_info: changedData.additional_info || profileBio.additional_info,
        };

        if (errorMessage) {
            ShowAlert.warning({ message: errorMessage });
            return;
        }

        changeProfileDataRequest({...changedBio })
            .then(response => response.json())
            .then(() => {
                setProfileData(prevData => ({
                    ...prevData,
                    ...changedBio
                }));
                setChangeMode(!changeMode);
            });
    };

    return (
        <Form>
            <Container>
                <Row className="mb-3">
                    <Form.Label column sm="3"><strong>ID:</strong></Form.Label>
                    <Col sm="9">
                        <Form.Control plaintext readOnly defaultValue={profileData.id} />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Label column sm="3"><strong>Username:</strong></Form.Label>
                    <Col sm="9">
                        <Form.Control plaintext readOnly defaultValue={profileData.username} />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Label column sm="3"><strong>Email:</strong></Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type='text'
                            defaultValue={profileData.email}
                            onChange={(e) => setChangedData({
                                ...changedData,
                                email: e.target.value
                            })}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Label column sm="3"><strong>Имя:</strong></Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type='text'
                            defaultValue={profileData.first_name}
                            onChange={(e) => setChangedData({
                                ...changedData,
                                first_name: e.target.value
                            })}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Label column sm="3"><strong>Фамилия:</strong></Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type='text'
                            defaultValue={profileData.last_name}
                            onChange={(e) => setChangedData({
                                ...changedData,
                                last_name: e.target.value
                            })}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Label column sm="3"><strong>Отчество:</strong></Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type='text'
                            defaultValue={profileData.last_name}
                            onChange={(e) => setChangedData({
                                ...changedData,
                                patronymic: e.target.value
                            })}
                        />
                    </Col>
                </Row>
                {/* <Row className="mb-3">
                    <Form.Label column sm="3"><strong>Номер телефона:</strong></Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type='phone'
                            defaultValue={profileData.phone_number}
                            onChange={(e) => setChangedData({
                                ...changedData,
                                bio: { ...changedData, phone_number: e.target.value }
                            })}
                        />
                    </Col>
                </Row> */}
                {/* <Row className="mb-3">
                    <Form.Label column sm="3"><strong>Дополнительная информация:</strong></Form.Label>
                    <Col sm="9">
                        <Form.Control
                            as="textarea"
                            defaultValue={profileData.additional_info}
                            onChange={(e) => setChangedData({
                                ...changedData,
                                bio: { ...changedData, additional_info: e.target.value }
                            })}
                        />
                    </Col>
                </Row> */}
                <Row>
                    <Col sm={{ span: 9, offset: 3 }}>
                        <PrimaryButton onClick={handleSave}>Сохранить изменения</PrimaryButton>
                    </Col>
                </Row>
            </Container>
        </Form>
    );
};