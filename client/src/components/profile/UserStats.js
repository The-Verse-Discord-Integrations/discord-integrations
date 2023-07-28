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
    const options = {
        responsive: true,
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
    const messageDataLength = messageData.length
    const messageDataFormatted = []

    for (let i = 0; i < 12; i++) {
        const index = messageDataLength - 1 - i
        if (messageData[index]) {
            labels.unshift(messageData[index][0])
            messageDataFormatted.unshift(messageData[index][1])
        } else {
            labels.unshift('')
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

    return (
        <div className="container mx-auto bg-white shadow xl:rounded overflow-hidden flex justify-center">
            <Bar options={options} data={data} />;
        </div>
    )
}

export default UserStats