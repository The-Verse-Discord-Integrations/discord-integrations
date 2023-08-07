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
        <div className="shadow-inner h-full flex flex-col xl:gap-y-3 relative">
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
    const currentProfile = { name: profile.name, startDate: profile.startDate, endDate: profile.endDate, weeklyHours: profile.weeklyHours, miro: profile.miro, github: profile.github, roles: profile.roles, skills: profile.skills }
    const [name, setName] = useState(currentProfile.name)

    const startDateNum = new Date(profile.startDate.slice(0, -14))
    const endDateNum = new Date(profile.endDate.slice(0, -14))
    const startDisplayDate = `${startDateNum.toLocaleString('default', { month: 'long' })} ${startDateNum.getFullYear()}`;
    const endDisplayDate = `${endDateNum.toLocaleString('default', { month: 'long' })} ${endDateNum.getFullYear()}`;

    let startMonth, startYear, endMonth, endYear
    [startMonth, startYear] = startDisplayDate.split(' ');
    [endMonth, endYear] = endDisplayDate.split(' ')
    const [startDateMonth, setStartDateMonth] = useState(startMonth)
    const [startDateYear, setStartDateYear] = useState(startYear)
    const [endDateMonth, setEndDateMonth] = useState(endMonth)
    const [endDateYear, setEndDateYear] = useState(endYear)

    const [weeklyHours, setWeeklyHours] = useState(currentProfile.weeklyHours)
    const [miro, setMiro] = useState(currentProfile.miro)
    const [github, setGithub] = useState(currentProfile.github)
    const [roles, setRoles] = useState(currentProfile.roles)
    const [skills, setSkills] = useState(currentProfile.skills)

    const [isButtonClicked, setIsButtonClicked] = useState({
        node: false,
        webDeveloper: false,
        gameDeveloper: false,
        soundEngineer: false,
        researcher: false,
        uiUx: false,

        unity: false,
        unreal: false,
        javascript: false,
        python: false,
        uiux: false,
        productManagement: false,
        research: false,
        soundDesign: false,
        visualDesign: false,
        communications: false,
        socialMedia: false,
        leadership: false,
        react: false,
        htmlCSS: false
    });

    return (
        <div className="absolute h-full w-full flex bg-[#202328]">
            <div className="relative xl:mt-5 container mx-auto bg-gray-600 shadow xl:rounded overflow-hidden h-fit p-4">

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
                </svg>
                <div className="font-bold text-xl text-white ml-6 mt-6">
                    Edit Profile
                </div>

                <div className="flex h-full items-center justify-center mt-6">
                    <div>
                        <img className="h-28 rounded-full border-white border-4" src={profile.avatarURL ? profile.avatarURL : "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v937-aew-111_3.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8ce2cd03f94f2baddcb332cfb50f78b9"} alt="" />
                    </div>
                </div>

                <div className="mt-6 ml-6">
                    <label htmlFor="name" className="block mb-1 font-semibold text-sm text-white">Name</label>
                    <input
                        type="text"
                        id="name"
                        className="p-2 w-52 h-8 bg-gray-300 rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mt-6 ml-6 flex justify-between">
                    <div>
                        <label className="block mb-1 font-semibold text-sm text-white">Start Date</label>
                        <div className="flex">
                            <div className="mr-4">
                                <label className="block mb-1 font-semibold text-xs text-white">Month</label>
                                <select className="p-2 w-30 h-8 bg-gray-300 rounded-md text-sm" value={startDateMonth} onChange={(e) => setStartDateMonth(e.target.value)}>
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold text-xs text-white">Year</label>
                                <select className="p-2 w-18 h-8 bg-gray-300 rounded-md text-sm" value={startDateYear} onChange={(e) => setStartDateYear(e.target.value)}>
                                    <option value="2020">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-sm text-white">End Date</label>
                        <div className="flex">
                            <div className="mr-4">
                                <label className="block mb-1 font-semibold text-xs text-white">Month</label>
                                <select className="p-2 w-30 h-8 bg-gray-300 rounded-md text-sm" value={endDateMonth} onChange={(e) => setEndDateMonth(e.target.value)}>
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold text-xs text-white">Year</label>
                                <select className="p-2 w-18 h-8 bg-gray-300 rounded-md text-sm" value={endDateYear} onChange={(e) => setEndDateYear(e.target.value)}>
                                    <option value="2020">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 ml-6">
                    <label htmlFor="hours" className="block mb-1 font-semibold text-sm text-white">Weekly Hours</label>
                    <input
                        type="text"
                        id="hours"
                        className="p-2 w-12 h-8 bg-gray-300 rounded-md"
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(e.target.value)}
                    />
                </div>

                <div className="mt-6 ml-6">
                    <label htmlFor="miro" className="block mb-1 font-semibold text-sm text-white">Miro Email</label>
                    <input
                        type="text"
                        id="miro"
                        className="p-2 w-52 h-8 bg-gray-300 rounded-md"
                        value={miro}
                        onChange={(e) => setMiro(e.target.value)}
                    />
                </div>

                <div className="mt-6 ml-6">
                    <label htmlFor="github" className="block mb-1 font-semibold text-sm text-white">Github Username</label>
                    <input
                        type="text"
                        id="github"
                        className="p-2 w-52 h-8 bg-gray-300 rounded-md"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                    />
                </div>

                <div className="mt-6 mx-6">
                    <label className="block mb-1 font-semibold text-sm text-white">Roles</label>
                    <div className="grid grid-cols-2 gap-2">
                        <CustomButton label="Node Management" isButtonClicked={isButtonClicked.node} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, node: !isButtonClicked.node })} />
                        <CustomButton label="Web Developer" isButtonClicked={isButtonClicked.webDeveloper} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, webDeveloper: !isButtonClicked.webDeveloper })} />
                        <CustomButton label="Game Developer" isButtonClicked={isButtonClicked.gameDeveloper} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, gameDeveloper: !isButtonClicked.gameDeveloper })} />
                        <CustomButton label="Sound Engineer" isButtonClicked={isButtonClicked.soundEngineer} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, soundEngineer: !isButtonClicked.soundEngineer })} />
                        <CustomButton label="Researcher" isButtonClicked={isButtonClicked.researcher} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, researcher: !isButtonClicked.researcher })} />
                        <CustomButton label="UI/UX" isButtonClicked={isButtonClicked.uiUx} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, uiUx: !isButtonClicked.uiUx })} />
                    </div>
                </div>

                <div className="mt-6 mx-6">
                    <label className="block mb-1 font-semibold text-sm text-white">Skills</label>
                    <div className="grid grid-cols-2 gap-2">
                        <CustomButton label="Unity" isButtonClicked={isButtonClicked.unity} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, unity: !isButtonClicked.unity })} />
                        <CustomButton label="Unreal" isButtonClicked={isButtonClicked.unreal} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, unreal: !isButtonClicked.unreal })} />
                        <CustomButton label="JavaScript" isButtonClicked={isButtonClicked.javascript} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, javascript: !isButtonClicked.javascript })} />
                        <CustomButton label="Python" isButtonClicked={isButtonClicked.python} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, python: !isButtonClicked.python })} />
                        <CustomButton label="UI/UX" isButtonClicked={isButtonClicked.uiux} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, uiux: !isButtonClicked.uiux })} />
                        <CustomButton label="Product Management" isButtonClicked={isButtonClicked.productManagement} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, productManagement: !isButtonClicked.productManagement })} />
                        <CustomButton label="Research" isButtonClicked={isButtonClicked.research} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, research: !isButtonClicked.research })} />
                        <CustomButton label="Sound Design" isButtonClicked={isButtonClicked.soundDesign} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, soundDesign: !isButtonClicked.soundDesign })} />
                        <CustomButton label="Visual Design" isButtonClicked={isButtonClicked.visualDesign} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, visualDesign: !isButtonClicked.visualDesign })} />
                        <CustomButton label="Communications Design" isButtonClicked={isButtonClicked.communications} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, communications: !isButtonClicked.communications })} />
                        <CustomButton label="Social Media" isButtonClicked={isButtonClicked.socialMedia} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, socialMedia: !isButtonClicked.socialMedia })} />
                        <CustomButton label="Leadership" isButtonClicked={isButtonClicked.leadership} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, leadership: !isButtonClicked.leadership })} />
                        <CustomButton label="React" isButtonClicked={isButtonClicked.react} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, react: !isButtonClicked.react })} />
                        <CustomButton label="HTML/CSS" isButtonClicked={isButtonClicked.htmlCSS} setIsButtonClicked={() => setIsButtonClicked({ ...isButtonClicked, htmlCSS: !isButtonClicked.htmlCSS })} />
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 font-semibold text-sm p-3 rounded-md"
                    >
                        Save Changes
                    </button>
                </div>

            </div>

        </div>
    )
}

const CustomButton = ({ label, isButtonClicked, setIsButtonClicked }) => {
    return (
        <button
            className={`bg-${isButtonClicked ? 'blue-500' : 'gray-300'} font-semibold text-sm h-10 rounded-md transition-colors duration-200`}
            onClick={() => setIsButtonClicked(!isButtonClicked)}
        >
            {label}
        </button>
    );
};

function updateButtons(roles, skills) {
    const roleMap = {
        'Node Management': 'node',
        'Web Developer': 'webDeveloper',
        'Game Developer': 'gameDeveloper',
        'Sound Engineer': 'soundEngineer',
        'Researcher': 'researcher',
        'UI/UX': 'uiUx'
    }
    const skillMap = {
        'Unity': 'unity',
        'Unreal': 'unreal',
        'JavaScript': 'javascript',
        'UI/UX': 'uiux',
        'Product Management': 'productManagement',
        'Research': 'research',
        'Sound Design': 'soundDesign',
        'Visual Design': 'visualDesign',
        'Communications Design': 'communications',
        'Social Media': 'socialMedia',
        'Leadership': 'leadership',
        'React': 'react',
        'HTML/CSS': 'htmlCSS'
    }
    const newButtonState = {  }
    roles.forEach(role => {
        switch (role) {
            case "Node Management":


        }
    })
}

export default Profile