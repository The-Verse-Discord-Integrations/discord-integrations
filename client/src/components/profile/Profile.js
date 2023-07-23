import React, { useContext } from 'react'
import { UserContext } from '../Home'
import { TailSpin } from "react-loading-icons";
import UserProjectInfo from './UserProjectInfo';
import UserStats from './UserStats';
import ProfileInfo from './ProfileInfo';

const Profile = () => {
    const profile = useContext(UserContext)

    return (
        <div className="xl:py-5 shadow-inner h-full flex flex-col xl:gap-y-3">
            {profile ?
                <React.Fragment>
                    <ProfileInfo profile={profile} />
                    <UserProjectInfo profile={profile}/>
                    <UserStats profile={profile}/>
                </React.Fragment>
                :
                <div className="h-full flex items-center justify-center">
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