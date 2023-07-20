import { useEffect, useState, createContext } from 'react';
import { useNavigate, useLoaderData, Outlet } from "react-router-dom";
import axios from 'axios';

export const UserContext = createContext(null);

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
                if (error.response.status === 401) {
                    navigate('/login')
                }
            }
        }
        getProfile()
    }, [navigate])
    return (
        <UserContext.Provider value={profile} >
            <div className="flex flex-col h-full">
                <Nav />
                <Outlet />
            </div>
        </UserContext.Provider>
    )
}

const Nav = () => {
    let navigate = useNavigate();

    return (
        <nav className="border-b bg-white">
            <div className="flex justify-between py-2 px-3  items-center container mx-auto">
                <header className="flex items-center hover:cursor-pointer" onClick={() => navigate('/')}>
                    <img className="h-10" src="https://media.licdn.com/dms/image/C560BAQGZsRf5Ro6Zbg/company-logo_200_200/0/1631752036761?e=2147483647&v=beta&t=kVWNkg1BQJDVWm4UhD8L8OmOLxhx_xc2Kc_-V_hC7DQ" alt="" />
                    <span className="px-2 font-medium text-xl tracking-tighter">The Verse</span>
                </header>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="rgb(216, 218, 221)"
                    className="bi bi-person-circle h-10 hover:cursor-pointer"
                    viewBox="0 0 16 16"
                    onClick={() => navigate('/profile')}
                >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                </svg>
            </div>
        </nav>
    )
}

export default Home;