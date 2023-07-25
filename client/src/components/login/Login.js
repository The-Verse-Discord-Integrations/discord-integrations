import LoginImage from './images/image.png'
import LoginVideo from './images/backgroundVideo.mp4'

const Login = () => {

    return (
        <div className="h-full flex flex-row relative overflow-hidden bg-cover" style={{ backgroundImage: `url(https://i.pinimg.com/originals/24/cc/eb/24cceb9cdcb03120898e70e2b42fc37d.jpg)` }}>
            <div className="grow relative w-1/2 xl:block hidden">
                <img className="w-32 absolute top-10 left-10" src={require('./images/VerseLogoAsset.png')} alt="" />
            </div>
            <div className="grow flex items-center justify-center w-1/2 flex-col text-center bg-[rgba(0,0,0,.2);]">
                <img className="w-32 xl:hidden" src={require('./images/VerseLogoAsset.png')} alt="" />
                <section className="my-10 xl:px-10">
                    <div className="xl:text-5xl text-2xl text-white font-bold mb-5">YOU'RE ALMOST THERE...</div>
                    <div className="xl:text-xl text-xl text-white px-10">Login with your discord to gain access to your member portal where you can access </div>
                </section>
                <a className="text-white border border-white rounded px-5 " href="http://localhost:3000/auth">Login With Discord</a>
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