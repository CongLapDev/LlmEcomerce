import imageFallback from '../../assets/image/image.png';
import LinkListItem from '../../components/link-list-Item/LinkListItem';
import { Link } from "react-router-dom";
import { Col, Row, Card, List, Spin } from "antd";
import style from './style.module.scss';
import PrefixIcon from '../../components/prefix-icon/PrefixIcon';
import { formatDate } from '../../utils/dateFormatter';
import APIBase from '../../api/ApiBase';
import { useDispatch } from "react-redux";
import { fetchUser } from "../../store/user/userSlide";
import { useState, useRef, useEffect } from 'react';

function UserInfor({ user }) {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);

    // Sync state when user prop updates
    useEffect(() => {
        if (user && user.picture) {
            setAvatarUrl(`${user.picture}?t=${new Date().getTime()}`);
        }
    }, [user?.picture]);

    const handleAvatarClick = () => {
        if (user && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validation based on PLAN rules
        if (file.size > 2 * 1024 * 1024) {
            alert('File must be smaller than 2MB');
            return;
        }
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Only JPG/PNG images are allowed');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);

        try {
            const res = await APIBase.post(`/api/v1/user/${user.id}/avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update local URL dynamically with cache busting
            setAvatarUrl(`${res.data.avatarUrl}?t=${new Date().getTime()}`);
            // Dispatch update to sync top-right header and Redux store
            dispatch(fetchUser());
        } catch (error) {
            alert('Failed to update avatar: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (<Card >
        <Col>
            <Spin spinning={loading} tip="Uploading...">
                <Row className={style.avatar} justify="center" style={{ cursor: "pointer" }} onClick={handleAvatarClick} title="Click to upload new avatar">
                    <img 
                        alt='avatar' 
                        src={avatarUrl || imageFallback} 
                        onError={(e) => { e.target.src = imageFallback; }} 
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                </Row>
            </Spin>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg" 
                style={{ display: 'none' }} 
            />
            <h3 className="text-center pt-4">{user ? `${user.lastname} ${user.firstname}` : <Link to="/login">Login</Link>}</h3>
        </Col>

        {user && <List>
            <LinkListItem title="Email" prefix={<PrefixIcon><i className="fi fi-rr-envelope"></i></PrefixIcon>}>
                {user.email}
            </LinkListItem>
            <LinkListItem title="Phone" prefix={<PrefixIcon><i className="fi fi-rr-phone-call"></i></PrefixIcon>}>
                {user.phoneNumber}
            </LinkListItem>
            <LinkListItem title="Gender" prefix={<i className="fi fi-rr-venus-mars"></i>}>
                {user.gender}
            </LinkListItem>
            <LinkListItem title="Birthday" prefix={<PrefixIcon><i className="fi fi-rr-cake-birthday"></i></PrefixIcon>}>
                {formatDate(user.dateOfBirth)}
            </LinkListItem>
            <LinkListItem title="Address" to={`/user/address`} prefix={<PrefixIcon><i className="fi fi-rr-building"></i></PrefixIcon>} arrow />
            <LinkListItem title="Payment" prefix={<PrefixIcon><i className="fi fi-sr-credit-card"></i></PrefixIcon>} arrow />
        </List>}
    </Card>);
}

export default UserInfor;