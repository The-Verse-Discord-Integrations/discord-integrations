import React, { useContext, useState } from 'react'
import { UserContext } from '../Home'
import { TailSpin } from "react-loading-icons";
import UserProjectInfo from './UserProjectInfo';
import UserStats from './UserStats';
import ProfileInfo from './ProfileInfo';

const Profile = () => {
    const profile = useContext(UserContext)
    const [showEditProfile, setShowEditProfile] = useState(false)
    console.log(profile)
    return (
        <div className="shadow-inner grow flex flex-col xl:gap-y-3 relative overflow-scroll">
            {profile ?
                <React.Fragment>
                    <ProfileInfo profile={profile} setShowEditProfile={setShowEditProfile} />
                    <UserProjectInfo profile={profile} />
                    <UserStats profile={profile} />
                </React.Fragment>
                :
                <div className="h-full flex items-center justify-center">
                    <TailSpin
                        className="h-12 w-12 mx-auto"
                        stroke="#3482F6"
                        speed={0.75}
                    />
                </div>}
            {showEditProfile && <EditProfile profile={profile} setShowEditProfile={setShowEditProfile} />}
        </div>
    )
}

const EditProfile = ({ profile, setShowEditProfile }) => {
    return (
        <div className="absolute h-full w-full flex bg-slate-500/50">
            <div className="relative xl:mt-5 container mx-auto bg-white shadow xl:rounded overflow-hidden h-fit p-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x-lg absolute top-2 right-2 hover:cursor-pointer"
                    viewBox="0 0 16 16"
                    onClick={() => setShowEditProfile(false)}
                >
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>Edit Profile Container</div>
        </div>
    )
}
export default Profile