import { useEffect, useState, createContext } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
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
                console.log(error)
                if (error.response.status === 401) {
                    navigate('/login')
                } else {
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
            <div className="flex justify-between py-2 xl:px-0 px-3  items-center container mx-auto">
                <header className="flex items-center hover:cursor-pointer" onClick={() => navigate('/')}>
                    <img className="h-10" src="https://media.licdn.com/dms/image/C560BAQGZsRf5Ro6Zbg/company-logo_200_200/0/1631752036761?e=2147483647&v=beta&t=kVWNkg1BQJDVWm4UhD8L8OmOLxhx_xc2Kc_-V_hC7DQ" alt="" />
                    <span className="px-2 font-medium text-xl tracking-tighter">The Verse</span>
                </header>
                <svg onClick={() => {axios.post('auth/logout');navigate('/login')}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-left hover:cursor-pointer" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                </svg>
            </div>
        </nav>
    )
}

export default Home;