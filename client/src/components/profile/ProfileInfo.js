const ProfileInfo = ({ profile, setShowEditProfile }) => {
    const rolesLength = profile ? profile.roles.length : null;
    return (
        <div className="xl:mt-5 container mx-auto bg-white xl:shadow border-b border-slate-100 xl:rounded">
            <div className="h-20 bg-gradient-to-r from-[#FDDAD8] to-[#F4F1BB]"></div>
            <div className="relative">
                <img className="h-28 absolute left-4 -top-14 rounded-full border-white border-4" src={profile.avatarURL ? profile.avatarURL : "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v937-aew-111_3.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8ce2cd03f94f2baddcb332cfb50f78b9"} alt="" />
                <div className="pt-14 p-6">
                    <h1 className="text-2xl font-semibold mb-1">{profile.name}</h1>
                    <div className="text-sm text-gray-600">
                        {profile.roles.map((role, index) => {
                            return <span key={role}>{role}{index !== rolesLength - 1 ? ' • ' : null}</span>
                        })}
                    </div>
                    <div>
                        {profile.selfProfile ? <button onClick={() => {setShowEditProfile(true)}} className="border border-black">Edit profile</button> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileInfo