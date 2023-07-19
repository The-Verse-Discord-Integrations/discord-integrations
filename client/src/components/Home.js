import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from "react-router-dom";
import axios from 'axios';

const Home = () => {
    const [profile, setProfile] = useState(null);

    let navigate = useNavigate();


    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get("/user/profile");
                console.log(response)
                setProfile(response.data);
            } catch (error) {
                if (error.response.status === '401') {
                    navigate('/login')
                }
            }
        }
        getProfile()
    }, [])
    return (
        <div>
            <h1>{profile ? profile.discordUsername : null}</h1>
        </div>
    )
}

export default Home;