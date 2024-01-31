
import { CSSProperties, useEffect, useRef } from 'react'

import Chart from 'chart.js/auto';
import { ChartTypeRegistry, ChartDataset, TooltipItem, ChartData, LegendItem, ChartConfiguration, ChartOptions } from 'chart.js';

export type ChartJSProps = {
	title: string,
	className?: string,
	type: keyof ChartTypeRegistry,
	data: ChartData,
	options: ChartOptions
};

export const ChartJS = ({ title, className, type, data, options }: ChartJSProps) => {
	const elChartRef = useRef<HTMLCanvasElement | null>(null);
	const chartDivStyle: CSSProperties = {};
	const chartDivClassName = "max-h-50";
	const isEmpty = data.datasets.length === 0;


	useEffect(() => {
		var chart: Chart | null = null;
		if (elChartRef && elChartRef.current) {
			const localOptions = { ...options };
			const config: ChartConfiguration = {
				type: type,
				data: data,
				options: options
			};
			chart = new Chart(elChartRef.current, config);
		}
		return () => {
			if (chart) {
				chart.destroy();
			}
		};
	}, []);

	return (
		<div>
			<h1 className="text-center text-xl font-bold p-2 bg-gray-200">{title}</h1>
			<div style={chartDivStyle} className={chartDivClassName}>
				<canvas
					ref={elChartRef}
				/>
			</div>
		</div>
	);

}
