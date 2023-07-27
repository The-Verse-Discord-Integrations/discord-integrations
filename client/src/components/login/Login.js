
const Login = () => {

    return (
        <div className="h-full flex flex-row relative overflow-hidden bg-cover" style={{ backgroundImage: `url(https://i.pinimg.com/originals/24/cc/eb/24cceb9cdcb03120898e70e2b42fc37d.jpg)` }}>
            <div className="grow relative w-1/2 xl:block hidden">
                <img className="w-24 absolute top-10 left-10 " src={require('./images/VerseLogoAsset.png')} alt="" />
                <div className="text-white font-semibold tracking-tight absolute left-10 bottom-10 max-w-lg">
                    <h1 className="text-3xl pb-2 text-slate-100">Lost In Liminal Space</h1>
                    <p className="text-slate-200">We believe that… “Every Person Has A Gift To Give"</p>
                    <p className="text-slate-200">What if… we made it easier for each person to find their gift and use their gift in a meaningful way. What would the world look like!</p>
                </div>

            </div>
            <div className="grow flex items-center w-1/2 flex-col xl:bg-[rgba(0,0,0,.5);] bg-gradient-to-t from-[rgba(0,0,0,.8)] to-[rgba(0,0,0,.2)]">
                <img className="w-16 xl:hidden absolute top-5 left-5" src={require('./images/VerseLogoAsset.png')} alt="" />
                <div className="flex flex-col items-center xl:mt-[30%] xl:justify-center mt-[195px] gap-5 text-center">
                    <img className="xl:w-36 w-32" src="https://iconsplace.com/wp-content/uploads/_icons/ffffff/256/png/meditation-guru-icon-18-256.png" alt="" />
                    <div className="text-white xl:text-5xl text-3xl">Your Journey Starts Here</div>
                    <div className="text-white max-w-[450px] mx-5 pb-5 border-b border-white/[.3]">Login with your discord to gain access to your member portal</div>
                    <a className="text-white bg-[#292f5e] hover:shadow-md hover:shadow-indigo-500/50 transition-shadow rounded px-14 py-1.5 flex items-center gap-4" href="http://localhost:3000/auth"><img className="w-10 inline" src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="" />Login With Discord</a>
                </div>
            </div>
        </div>
    )
}

// const Nav = () => {
//     return (
//         <nav className="border-b bg-white">
//             <div className="flex justify-between py-2 xl:px-0 px-3  items-center container mx-auto">
//                 <header className="flex items-center hover:cursor-pointer">
//                     <img className="h-10" src="https://media.licdn.com/dms/image/C560BAQGZsRf5Ro6Zbg/company-logo_200_200/0/1631752036761?e=2147483647&v=beta&t=kVWNkg1BQJDVWm4UhD8L8OmOLxhx_xc2Kc_-V_hC7DQ" alt="" />
//                     <span className="px-2 font-medium text-xl tracking-tighter">The Verse</span>
//                 </header>
//             </div>
//         </nav>)
// }
export default Login