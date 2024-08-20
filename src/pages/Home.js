import React from 'react';
import { useAuth } from "../contexts/Auth";
import { Navigate } from 'react-router-dom';
import { UncontrolledCarousel } from 'reactstrap';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import '../App.css'

export default function Home() {
    const { user } = useAuth();

    const carouselItems = [
        {
            altText: 'Slide 1',
            caption: 'Slide 1',
            key: 1,
            src: image1
        },
        {
            altText: 'Slide 2',
            caption: 'Slide 2',
            key: 2,
            src: image2
        },
        {
            altText: 'Slide 3',
            caption: 'Slide 3',
            key: 3,
            src: image3
        }
    ];

    return (
        <div className='carousal'>
            
            {!user && (
                <div>
                    <UncontrolledCarousel items={carouselItems} interval={4000} />
                    <p>User not logged in</p>
                </div>
            )}
            {user && (() => {
                switch (user.role) {
                    case 'admin':
                        return <Navigate to="/admin" />;
                    case 'caterer':
                        return <Navigate to={`/caterer/login/${user._id}`} />;
                    case 'customer':
                        return <Navigate to={`/customer/login/${user._id}`} />;
                    default:
                        return <p>Welcome {user.username}</p>;
                }
            })()}
        </div>
    );
}