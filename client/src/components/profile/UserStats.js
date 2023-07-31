import React from 'react';
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
        <div className="container relative mx-auto bg-white border-b border-slate-100 xl:shadow xl:rounded flex xl:flex-row flex-col justify-center w-full h-max">
            <WeeklyBarChart profile={profile}/>
        </div>
    )
}

const WeeklyBarChart = ({profile}) => {
    const options = {
        responsive: true,
        aspectRatio: 1 | 2,

        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${profile.name} message chart`,
            },
        },
    };

    const labels = []
    const messageData = profile.weeklyMessageCountArray
    const messageDataFormatted = []
    const currentWeekNum = parseInt(messageData[messageData.length - 1][0])

    for (let i = 0; i < 12; i++) {
        const index = messageData.length - 1 - i
        if (messageData[index]) {
            labels.unshift(getWeekString(messageData[index][0]))
            messageDataFormatted.unshift(messageData[index][1])
        } else {
            labels.unshift(getWeekString(currentWeekNum - i))
            messageDataFormatted.unshift(0)
        }
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: messageDataFormatted,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return <Bar options={options} data={data} />
}

const getWeekString = (unixWeek) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    unixWeek = parseInt(unixWeek)

    const weekStart = new Date((unixWeek * 604800000) - 259200000)
    const weekEnd = new Date(weekStart.getTime() + 518400000)

    return `${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${months[weekEnd.getMonth()]} ${weekEnd.getDate()}`
}

export default UserStats