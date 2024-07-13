import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ArcElement, Tooltip, Legend);

const LineChart = ({data, options}) => {
    return (
        <Line data={data} options={options} />
    )
}

export default LineChart;

