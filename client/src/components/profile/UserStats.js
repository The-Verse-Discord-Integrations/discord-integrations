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

    return (
        <div className="container relative mx-auto bg-white xl:border-b-0 border-b border-slate-100 xl:shadow xl:rounded flex xl:flex-row flex-col justify-center w-full xl:py-10 xl:pr-10 xl:pl-5">
            <WeeklyBarChart profile={profile}/>
        </div>
    )
}

const WeeklyBarChart = ({profile}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth)
            console.log(window.innerWidth)
        })
        return () => window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth)
        })
    })

    const options = {
        responsive: true,
        aspectRatio: 1 | 2,
        plugins: {
            legend: {
                position: 'top',
                display: false
            },
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    display: windowWidth > 425 ? true : false,
                    font: {
                        size: windowWidth > 1024 ? 10 : windowWidth >= 768 ? 8 : 0
                    }
                },
            },
            y: {
                title: {
                    display: windowWidth >= 1024 ? true : false,
                    text: windowWidth >= 1024 ? "Messages" : '',
                    font: windowWidth >= 1024 ? {size: 24} : null
                },
                grace: '5%'
            }
        },
        barPercentage: .7,
    };

    const labels = []
    const messageData = profile.weeklyMessageCountArray
    const messageDataFormatted = []
    const currentWeekNum = parseInt(messageData[messageData.length - 1][0])

    for (let i = 0; i < 12; i++) {
        const index = messageData.length - 1 - i
        if (messageData[index]) {
            labels.unshift(getWeekString(messageData[index][0], windowWidth))
            messageDataFormatted.unshift(messageData[index][1])
        } else {
            labels.unshift(getWeekString(currentWeekNum - i, windowWidth))
            messageDataFormatted.unshift(0)
        }
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Messages',
                data: messageDataFormatted,
                backgroundColor: 'rgba(253, 218, 216, 1)',
            },
        ],
    };

    return <Bar options={options} data={data} />
}

const getWeekString = (unixWeek, windowWidth) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    unixWeek = parseInt(unixWeek)

    const weekStart = new Date((unixWeek * 604800000) - 259200000)
    const weekEnd = new Date(weekStart.getTime() + 518400000)

    return `${windowWidth >= 1024 ? months[weekStart.getMonth()] : weekStart.getMonth() + 1 + '/'}${windowWidth >= 1024 ? ' ' : '/'}${weekStart.getDate()} - ${windowWidth >= 1024 ? months[weekEnd.getMonth()] : weekStart.getMonth() + 1 + '/'}${windowWidth >= 1024 ? ' ' : '/'}${weekEnd.getDate()}`
}

export default UserStats