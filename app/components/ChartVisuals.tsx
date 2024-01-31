
import { Post } from '@prisma/client';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartJS } from './ChartJS';

export type ChartVisualsProps = {
	posts: Post[]
};

export const ChartVisuals = ({ posts }: ChartVisualsProps) => {

	const topicMap: { [topic: string]: number } = {};
	posts.forEach(post => {
		if (!topicMap[post.topic]) {
			topicMap[post.topic] = 0;
		}
		topicMap[post.topic]++;
	});

	const topics = Object.entries(topicMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
	const data: ChartData = {
		labels: topics.map(([topic, count]) => topic),
		datasets: [
			{
				label: '# of Posts',
				data: topics.map(([topic, count]) => count)
			}
		]
	};

	const options: ChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			intersect: false,
			mode: 'index'
		},
		scales: {
			y: {
				grace: "5%",
				beginAtZero: true,
				ticks: {
					precision: 0
				}
			}
		}
	};


	return (
		<div>
			<ChartJS title="Trending Topics" type="bar" data={data} options={options} type="bar"></ChartJS>
		</div>
	);
}
