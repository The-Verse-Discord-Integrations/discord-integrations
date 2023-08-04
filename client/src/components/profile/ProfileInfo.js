const ProfileInfo = ({ profile, setShowEditProfile }) => {
    const rolesLength = profile ? profile.roles.length : null;
    const projectsLength = profile ? profile.projects.length : null;
    const skillsLength = profile ? profile.skills.length : null;
    const startDate = new Date(profile.startDate.slice(0, -14))
    const endDate = new Date(profile.endDate.slice(0, -14))

    const startDisplayDate = `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`;
    const endDisplayDate = `${endDate.toLocaleString('default', { month: 'long' })} ${endDate.getFullYear()}`;


    return (
        <div className="xl:mt-5 container mx-auto bg-[#202328] xl:shadow xl:border-b-0 border-b-2 border-slate-100 xl:rounded text-white">
            <div className="h-20 bg-gradient-to-r from-[#020429] to-[#134354] xl:rounded"></div>
            <div className="relative">
                <img className="h-28 absolute left-4 -top-14 rounded-full border-[#202328] border-4" src={profile.avatarURL ? profile.avatarURL : "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v937-aew-111_3.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8ce2cd03f94f2baddcb332cfb50f78b9"} alt="" />
                <div className="pt-20 p-6">
                    <h1 className="text-2xl font-semibold mb-1">{profile.name}</h1>
                    <div className="flex items-center space-x-1 py-1 text-slate-300">
                        <img className="w-5 h-5" src={require('./images/VerseLogoAsset.png')} alt="" />
                        <div>
                            {profile.roles.map((role, index) => {
                                return <span key={role}>{role}{index !== rolesLength - 1 ? ' • ' : null}</span>
                            })}
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 py-1 text-slate-300">
                        <img className="w-5 h-5" src={require('./images/clock.png')} alt="" />
                        <div>{startDisplayDate} - {endDisplayDate} • {profile.weeklyHours}hr/week</div>
                    </div>

                    <div className="flex items-center space-x-1 py-1 text-slate-300">
                        <img className="w-5 h-5" src={require('./images/miroLogo.png')} alt="" />
                        <div>{profile.miro}</div>
                    </div>

                    {profile.github && profile.github.trim() !== "" && (
                        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline text-slate-300 py-1">
                            <div className="flex items-center space-x-1">
                                <img className="w-5 h-5" src={require('./images/githubLogo.png')} alt="" />
                                <div>{profile.github}</div>
                            </div>
                        </a>
                    )}
                    {/*<div className="text-sm text-gray-600">*/}
                    {/*    {profile.skills.map((skill, index) => {*/}
                    {/*        return <span key={skill}>{skill}{index !== skillsLength - 1 ? ' • ' : null}</span>*/}
                    {/*    })}*/}
                    {/*</div>*/}

                    <div className="border-y-2 pt-1 pb-4 mt-1 mb-2 text-sm">
                        <h1 className="text-lg font-semibold mb-3">Skills</h1>
                        {profile.skills.map((skill, index) => {
                            return <span key={skill} className="border-2 rounded-xl p-2 mr-1">{skill}</span>
                        })}
                    </div>

                    <div>
                        {profile.selfProfile ? <button onClick={() => {setShowEditProfile(true)}} className="bg-blue-800 hover:bg-blue-900 rounded-xl p-2 text-white font-semibold">Edit profile</button> : null}
                    </div>
                </div>

            </div>

        </div>

    )
}

export default ProfileInfo