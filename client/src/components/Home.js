import { useEffect, useState, createContext } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import { TailSpin } from "react-loading-icons";
import logo from './login/images/VerseLogoAsset.png'
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
                <Footer />
            </div>
        </UserContext.Provider>
    )
}

const Nav = () => {
    let navigate = useNavigate();

    return (
        <nav className="bg-[#202328]">
            <div className="flex justify-between py-2 xl:px-0 px-3  items-center container mx-auto">
                <header className="flex items-center hover:cursor-pointer" onClick={() => navigate('/')}>
                    <img className="h-10" src={logo} alt="" />
                    <span className="px-2 font-medium text-xl tracking-tighter text-white">The Verse</span>
                </header>
                <Search />
            </div>
        </nav>
    )
}

const Footer = () => {
    let navigate = useNavigate();
    return (
        <footer className="bg-[#202328]">
            <div className="container mx-auto flex justify-end py-2 xl:px-0 px-3">
                <svg onClick={() => { axios.post('auth/logout'); navigate('/login') }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-box-arrow-left hover:cursor-pointer" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                </svg>
            </div>
        </footer>
    )
}

const Search = () => {
    const [active, setActive] = useState(false)
    const [displayResults, setDisplayResults] = useState(false)
    const [input, setInput] = useState('')
    const [searchResults, setSearchResults] = useState(undefined)

    const handleChange = (event) => {
        setInput(event.target.value)
        setDisplayResults(true)
        if (event.target.value === '') {
            setDisplayResults(false)
        }
        setSearchResults(undefined)
    }

    const handleBlur = () => {
        setActive(false)
        setDisplayResults(false)
        setInput('')
    }
    return (
        <div className={` hover:bg-gray-700 ${active && 'bg-gray-700'} rounded ${displayResults && 'rounded-bl-none rounded-br-none'} hover:cursor-pointer flex relative`} onClick={() => setActive(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-search m-2" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            {active && <input value={input} onChange={handleChange} className="bg-gray-700 outline-none text-white mr-2 w-30" autoFocus onBlur={handleBlur} />}
            {displayResults &&
                <div className="absolute -bottom-[100px] h-[100px] z-50 bg-gray-700 w-full rounded-bl rounded-br">
                    {searchResults ?
                        <div>search results</div> :
                        <div className="h-full flex items-center justify-center">
                            <TailSpin
                                className="h-6 w-6 mx-auto"
                                stroke="#3482F6"
                                speed={0.75}
                            />
                        </div>}
                </div>
            }
        </div>
    )
}
export default Home;