import React, { useEffect, useState } from 'react';
import * as d3 from "d3";

function DrawData(){
	const [data, setData] = useState([]);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const response = await fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json')
	// 			const jsonData = await response.json();
	// 			const colorData = jsonData.map((data) => {
	// 				let color;
	// 				if(data.species === "setosa")
	// 					color = d3.schemeCategory10[0];
	// 				else if(data.species === "versicolor")
	// 					color = d3.schemeCategory10[1];
	// 				else
	// 					color = d3.schemeCategory10[2];
	// 				return {...data, color}
	// 			})
	// 			setData(colorData);
	// 		} catch (error) {
	// 			console.log('取得に失敗', error);
	// 		}
	// 	};
	// 	fetchData();
	// }, []);
	// console.log(data);

	const url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json";

	useEffect(() => {
	  fetch(url)
		.then((response) => response.json())
		.then((response) => {
			const colorData = response.map((item) => {
				let color;
				if (item.species === "setosa") {
					color = d3.schemeCategory10[0];
				} else if (item.species === "versicolor") {
					color = d3.schemeCategory10[1];
				} else {
					color = d3.schemeCategory10[2];
				}
				return {...item, color};
			});
			setData(colorData);
			// setData(response);
		})
	},[]);
	console.log(data);

	// const colorData = data.map((data) => {
	// 	let color;
	// 	if(data.species === "setosa")
	// 		color = d3.schemeCategory10[0];
	// 	else if(data.species === "versicolor")
	// 		color = d3.schemeCategory10[1];
	// 	else
	// 		color = d3.schemeCategory10[2];
	// 	return {...data, color}
	// 	})
	// 	setData(colorData);


	const w= 600;
	const h = 600;
	const xaxis = 100;
	const yaxis = h - 100;
	// const sepalLength = data.map(data => {
	// 	return [data.sepalLength];
	// });
	// console.log(sepalLength);
	const xScale = d3.scaleLinear()
				.domain(d3.extent(data, data => data.sepalLength))
				.range([100, w - 100])
				.nice();
	const yScale = d3.scaleLinear()
				.domain(d3.extent(data, data => data.sepalWidth))
				.range([500, 100])
				.nice();
	console.log(xScale.ticks());

	const unitX = 400 / (xScale.ticks().length - 1);
	const unitY = 400 / (yScale.ticks().length - 1);
	// const xScale = d3.scaleLinear()
	// 			.domain(d3.extent(sepalLength))
	// 			.range([xaxis, w])
	// 			.nice();
	// const yScale = d3.scaleLinear()
	// 			.domain(d3.extent(sepalLength))
	// 			.range([yaxis, 100])
	// 			.nice();
	// console.log(d3.extent(sepalLength));
	// console.log(sepalLength[0]);
	// console.log(xScale(sepalLength[0])); //137.49999999999994
	return (
		<svg width={w} height={h}>
			<line x1={xaxis} y1={yaxis} x2={w - 100} y2={yaxis} stroke='black' />
			<g>
				{
				xScale.ticks().map((data, index) => {
					const t = `translate(${100 + index * unitX}, ${500})`;
					return (
						<g transform={t} key={index} >
							<line x1={0} y1={0} x2={0} y2={5} stroke="black"/>
							<text x={0} y={15} textAnchor='middle' dominantBaseline="central" stroke="black">{data}</text>
						</g>
					);
				})
				}
			</g>
			<line x1={xaxis} y1={xaxis} x2={xaxis} y2={yaxis} stroke='black' />
			<g>
				{
				yScale.ticks().map((data, index) => {
					const t = `translate(${100}, ${500 - unitY * index})`;
					return (
						<g transform={t} key={index} >
							<line x1={0} y1={0} x2={-5} y2={0} stroke="black"/>
							<text x={-15} y={0} textAnchor='end' dominantBaseline="central" stroke="black">{data}</text>
						</g>
					);
				})
				}
			</g>
			{
			data.map((data, index) => (
				<circle key={index} cx={xScale(data.sepalLength)} cy={yScale(data.sepalWidth)} r="5" fill={data.color} stroke={data.color} />
			))
			}
			{/* {
				for(const data of data){
					<circle key={index} cx={xScale(data.sepalLength)} cy={yScale(data.sepalWidth)} r="5" fill={data.color} stroke={data.color} />
				}
			}; */}
			{/* {sepalLength.map((element, index) => (
				<circle key={index} cx={xScale(element[0])} cy={yScale(element[0])} r="5" fill="blue" stroke="blue" />
			))}; */}
		</svg>
	);
};

function App() {
	//2つの値を保持。
	return (
	  <div>
		<DrawData />
		<h1>Hello, World!</h1>
	  </div>
	);
  }

  export default App;

