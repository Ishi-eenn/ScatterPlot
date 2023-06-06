import React, { useEffect, useState } from 'react';
import Select from "react-select";
import * as d3 from "d3";

function DrawData(xs) {
	const [data, setData] = useState([]);

	const url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json";

	useEffect(() => {
		fetch(url)
			.then((response) => response.json())
			.then((response) => {
				setData(response);
			})
	}, []);
	console.log(data);

	const w = 800;
	const h = 600;
	const xaxis = 100;
	const yaxis = h - 100;
	const xProperty = "sepalLength";
	const yProperty = "sepalWidth";

	const xScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item[xProperty]))
		.range([100, w - 300])
		.nice();
	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item[yProperty]))
		.range([500, 100])
		.nice();
	console.log(xScale.ticks());

	const color = d3.scaleOrdinal(d3.schemeCategory10);
	const setSpecies = new Set(data.map((data) => {
		return data.species;
	}));
	console.log(setSpecies);
	return (
		<svg width={w} height={h}>
			<line x1={xaxis} y1={yaxis} x2={w - 300} y2={yaxis} stroke='black' />
			<g>
				{
					xScale.ticks().map((data, index) => {
						return (
							<g transform={`translate(${xScale(data)}, ${500})`} key={index} >
								<line x1={0} y1={0} x2={0} y2={5} stroke="black" />
								<text x={0} y={15} textAnchor='middle' dominantBaseline="central" stroke="black" fontSize="16" >{data}</text>
							</g>
						);
					})
				}
			</g>
			<line x1={xaxis} y1={xaxis} x2={xaxis} y2={yaxis} stroke='black' />
			<g> {/* y軸ラベル */}
				{
					yScale.ticks().map((data, index) => {
						return (
							<g transform={`translate(${100}, ${yScale(data)})`} key={index} >
								<line x1="0" y1="0" x2="-5" y2="0" stroke="black" />
								<text x="-15" y="0" textAnchor="end" dominantBaseline="central" stroke="black" fontSize="16" >{data}</text>
							</g>
						);
					})
				}
			</g>
				{
					data.map((data, index) => (
						<circle key={index} cx={xScale(data[xProperty])} cy={yScale(data[yProperty])} r="5" fill={color(data.species)} stroke={data.color} />
					))
				}
				<g transform="translate(450, -300)">
					{
						Array.from(setSpecies).map((species, index) => (
							<g key={index} transform={`translate(${xaxis}, ${yaxis + index * 20})`}>
								<rect x="0" y="0" width="10" height="10" fill={color(species)}></rect>
								<text x="15" y="5" dominantBaseline="middle" fontSize="16" >{species}</text>
							</g>
						))
					}
				</g>
			<text x={w / 2 - 100} y={h - 50} textAnchor="middle" dominantBaseline="middle" fontSize="16" >sepalLength</text>
			<text x={300} y={(h - 550) / 2 + yaxis} textAnchor="middle" dominantBaseline="middle" fontSize="16" transform={`rotate(-90, 60, ${(h - yaxis) / 2 + yaxis})`}>
			sepalWidth
			</text>
		</svg>
	);
};

function App() {
	//2つの値を保持。
	const options = [
		{ value: "sepalLength", label: "Sepal Length" },
		{ value: "sepalWidth", label: "Sepal Width" },
		{ value: "petallLength", label: "Petal Length" },
		{ value: "petalWidth", label: "Petal Width" },
	];
	const [selectedXValue, setSelectedXValue] = useState(options[0]);
	const [selectedYValue, setSelectedYValue] = useState(options[0]);
	console.log(selectedXValue);
	console.log(selectedYValue);

	return (
	<div style={{ width: "300px", margin: "50px" }}>
		<p>Horizontal Axis</p>
		<Select options={options} defaultValue={selectedXValue} onChange={(value) => {
				value ? setSelectedXValue(value) : sepalWidth;
			}}
		/>
		<p>Vertical Axis</p>
		<Select options={options} defaultValue={selectedYValue} onChange={(value) => {
				value ? setSelectedYValue(value) : sepalWidth;
			}}
		/>
		<DrawData setSelectedValue/>
		<h1>Hello, World!</h1>
	</div>
	);
}

export default App;

