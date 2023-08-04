import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const UserStats = ({ profile }) => {
    const [windowOffset, setWindowOffset] = useState(0)
    const [showWeek, toggleShowWeek] = useState(true)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    })

    const handleToggleShowWeek = () => {
        setWindowOffset(0);
        toggleShowWeek(!showWeek)
    }
    return (
        <div className="container mx-auto flex flex-col border-t py-6 border-slate-500">
            <h1 className="text-[24px] text-white xl:px-0 px-4 md:block hidden">Messages</h1>
            <div className="flex flex-row-reverse justify-between py-2 xl:px-0 px-4">
                <div className='flex gap-2'>
                    <button className="bg-[#202328] rounded px-2" onClick={() => setWindowOffset(windowOffset - 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                    </button>
                    <button className="bg-[#202328] px-2 text-white" onClick={handleToggleShowWeek}>{showWeek ? 'week' : 'day'}</button>
                    <button className="bg-[#202328] rounded px-2 disabled:opacity-20" onClick={() => setWindowOffset(windowOffset + 1)} disabled={!windowOffset}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                        </svg>
                    </button>
                </div>
                <h2 className="text-slate-300 md:block hidden">{profile.name}'s message count</h2>
                <h2 className="text-slate-300 md:hidden">Messages</h2>
            </div>
            <div className="relative mx-auto bg-[#202328] xl:border-b-0 xl:shadow xl:rounded flex xl:flex-row flex-col justify-center w-full xl:py-10 xl:pr-10 xl:pl-5 md:py-5 pr-4 pl-1 pb-1">
                <BarChart profile={profile} windowOffset={windowOffset} windowWidth={windowWidth} showWeek={showWeek}/>
            </div>
        </div>
    )
}

const BarChart = ({ profile, windowOffset, windowWidth, showWeek }) => {
    const options = {
        responsive: true,
        aspectRatio: windowWidth > 425 ? 1 | 2 : 1 | 1,
        plugins: {
            legend: {
                position: 'top',
                display: false
            },
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    display: windowWidth > 425 ? true : false,
                    font: {
                        size: windowWidth > 1024 ? 10 : windowWidth >= 768 ? 8 : 0
                    },
                    color: 'white'
                },
            },
            y: {
                title: {
                    display: windowWidth >= 1024 ? true : false,
                    text: windowWidth >= 1024 ? "Messages" : '',
                    font: windowWidth >= 1024 ? { size: 18 } : null,
                    color: 'white'
                },
                grace: '10%',
                ticks: {
                    color: 'white',
                    padding: 10,
                },
                grid: {
                    color: 'rgb(156 163 175)',
                    drawTicks: false,
                    drawBorder: false
                }
            }
        },
        barPercentage: .7,
    };
    
    const weeklyChartData = getWeeklyChartData(profile, windowOffset, windowWidth)
    const dailyChartData = getDailyChartData(profile, windowOffset, windowWidth)
    return <Bar options={options} data={showWeek ? weeklyChartData : dailyChartData} />
}

const getWeeklyChartData = (profile, windowOffset, windowWidth) => {
    const labels = []
    const messageData = profile.weeklyMessageCountArray
    const messageDataFormatted = []
    const currentWeekNum = parseInt(messageData[messageData.length - 1][0])

    for (let i = 0; i < 12; i++) {
        const index = messageData.length - 1 - i + (windowOffset  * 12)
        if (messageData[index]) {
            labels.unshift(getWeekString(messageData[index][0], windowWidth))
            messageDataFormatted.unshift(messageData[index][1])
        } else {
            labels.unshift(getWeekString(currentWeekNum - i + (windowOffset * 12), windowWidth))
            messageDataFormatted.unshift(0)
        }
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Messages',
                data: messageDataFormatted,
                backgroundColor: '#704dcb',
            },
        ],
    };

    return data
}

const getDailyChartData = (profile, windowOffset, windowWidth) => {

    const labels = []
    const messageData = profile.weeklyMessageCountArray
    const messageDataFormatted = []
    const currentWeekNum = parseInt(messageData[messageData.length - 1][0])

    for (let i = 0; i < 2; i++) {
        const index = messageData.length - 1 - i + (windowOffset * 2)
        
        if (!messageData[index]) {
            messageDataFormatted.unshift(...[0, 0, 0, 0, 0, 0, 0])
        } else {
            messageDataFormatted.unshift(...messageData[index][2])
        }
        labels.unshift(...getDayString(currentWeekNum - i + (windowOffset * 2)))
    }

    return {
        labels: labels,
        datasets: [
            {
                label: 'Messages',
                data: messageDataFormatted,
                backgroundColor: '#704dcb'
            }
        ]
    }
}
const getWeekString = (unixWeek, windowWidth) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    unixWeek = parseInt(unixWeek)

    const weekStart = new Date((unixWeek * 604800000) - 259200000)
    const weekEnd = new Date(weekStart.getTime() + 518400000)

    return `${windowWidth >= 1024 ? months[weekStart.getMonth()] : weekStart.getMonth() + 1 + '/'}${windowWidth >= 1024 ? ' ' : '/'}${weekStart.getDate()} - ${windowWidth >= 1024 ? months[weekEnd.getMonth()] : weekStart.getMonth() + 1 + '/'}${windowWidth >= 1024 ? ' ' : '/'}${weekEnd.getDate()}`
}

const getDayString = (unixWeek, windowWidth) => {
    // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const days = ['Sun','Mon', 'Tues', 'Wed', 'Thr', 'Fri', 'Sat']
    const labels = []
    for (let i = 6; i >= 0; i--) {
        const day = new Date((unixWeek * 604800000) - 259200000 + (i * 86400000))
        labels.unshift(`${days[day.getDay()]} ${day.getDate()}`)
    }
    return labels
}
export default UserStats