import { useContext } from 'react'
import { UserContext } from './Home'
import { TailSpin } from "react-loading-icons";


const Profile = () => {
    const profile = useContext(UserContext)
    const rolesLength = profile ? profile.roles.length : null;

    return (
        <div className="sm:py-5 shadow-inner h-full">
            {profile ? <div className="container mx-auto bg-white shadow sm:rounded overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-sky-500 to-indigo-500">
                </div>
                <div className="relative">
                    <img className="h-28 absolute left-4 -top-14 rounded-full border-white border-4" src="https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v937-aew-111_3.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8ce2cd03f94f2baddcb332cfb50f78b9" alt="" />
                    <div className="pt-20 px-6">
                        <h1 className="text-2xl font-semibold mb-1">{profile.name}</h1>
                        <div className="text-sm text-gray-600">
                            {profile.roles.map((role, index) => {
                                return <span key={role}>{role}{index !== rolesLength - 1 ? ' • ' : null}</span>
                            })}
                        </div>
                    </div>
                </div>
            </div> : <div className="h-full flex items-center justify-center">
                <TailSpin
                    className="h-12 w-12 mx-auto"
                    stroke="#3482F6"
                    speed={0.75}
                />
            </div>}
        </div>
    )
}

export default Profile