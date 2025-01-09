import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { getProfileDataRequest, changeProfileDataRequest } from '../../requests/userRequests/profile';

import { ProfileBlock } from './pageComponents/profileBlock/ProfileBlock';

import { COLORS } from '../../components/Colors';

const MyProfilePage = () => {
    const [ profileData, setProfileData ] = useState()

    useEffect(() => {
        const _ = async () => {
            await getProfileDataRequest()
            .then(response => {return response.json()})
            .then(data => {
                setProfileData(data)
            })
        }
        _()
    }, [])

  return (
    <Container>
      <Row className="mt-4">
        <Col md={4}>
            <ProfileImage photoPath={
                    profileData && profileData.photo
                    ? profileData.photo
                    : "/images/profile-icon.jpeg"
                }
            />
        </Col>

        <Col md={8}>
            {
                profileData ?
                <ProfileBlock
                    profileData={profileData}
                    setProfileData={setProfileData}
                />
                : null
            }
        </Col>
      </Row>
    </Container>
  );
};

const ProfileImage = ({ photoPath }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [profileImage, setProfileImage] = useState(photoPath);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('photo', file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
            changeProfileDataRequest(formData);
        }
    };

    const handleClick = () => {
        document.getElementById('fileInput').click();
    };

    useEffect(() => {
        setProfileImage(photoPath)
    }, [photoPath])

    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-block',
            }}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
        >
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
            />
            {isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        background: 'rgba(0, 0, 0, 0.5)',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        zIndex: 1
                    }}
                    onClick={handleClick}
                >
                    Изменить
                </div>
            )}
            <Image
                src={profileImage}
                thumbnail
                rounded
                fluid
                className="mb-3"
                alt="Profile Icon"
                style={{
                    opacity: isHovered ? 0.5 : 1,
                    transition: 'opacity 0.3s ease',
                    backgroundColor: COLORS.secondary,
                }}
            />
        </div>
    );
};

export default MyProfilePage;
