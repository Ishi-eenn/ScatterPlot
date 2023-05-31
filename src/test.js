const ScatterPlot = ({ data, margin, contentWidth, contentHeight, xProperty, yProperty }) => {
	const width = contentWidth + margin * 2
	const height = contentHeight + margin * 2

	const xScale = d3.scaleLinear()
	  .domain(d3.extent(data, (item) => item[xProperty.property]))
	  .range([0, contentWidth])
	  .nice()
	const yScale = d3.scaleLinear()
	  .domain(d3.extent(data, (item) => item[yProperty.property]))
	  .range([contentHeight, 0])
	  .nice()
	const color = d3.scaleOrdinal(d3.schemeCategory10)
	for (const item of data) {
	  color(item.species)
	}

	const [visibility, setVisibility] = React.useState(new Set(color.domain()))
	return (
	  <svg width={width} height={height}>
		<g transform={`translate(${margin},${margin + contentHeight})`}>
		  <line x0='0' y0='0' x1={contentWidth} y1='0' stroke='black'/>
		  {xScale.ticks().map((x, i) => {
			return (
			  <g key={i} transform={`translate(${xScale(x)},0)`}>
				<line x0='0' y0='0' x1='0' y1='5' stroke='black'/>
				<text y='20' textAnchor='middle'>{x}</text>
			  </g>
			)
		  })}
		  <text
			transform={`translate(${contentWidth / 2},40)`}
			textAnchor='middle'
		  >
			{xProperty.label}
		  </text>
		</g>
		<g transform={`translate(${margin},${margin})`}>
		  <line x0='0' y0='0' x1='0' y1={contentHeight} stroke='black'/>
		  {yScale.ticks().map((y, i) => {
			return (
			  <g key={i} transform={`translate(0,${yScale(y)})`}>
				<line x0='0' y0='0' x1='-5' y1='0' stroke='black'/>
				<text x='-8' y='5' textAnchor='end'>{y}</text>
			  </g>
			)
		  })}
		  <text
			transform={`translate(-40,${contentHeight / 2})rotate(-90)`}
			textAnchor='middle'
		  >
			{yProperty.label}
		  </text>
		</g>
		<g transform={`translate(${margin},${margin})`}>
		  {data.filter((item) => !visibility.has(item.species)).map((item) => {
			return (
			  <circle
				key={item.id}
				cx={xScale(item[xProperty.property])}
				cy={yScale(item[yProperty.property])}
				r='5'
				fill={color(item.species)}
				style={{
				  transitionDuration: '1s'
				}}
			  />
			)
		  })}
		</g>
		<g transform={`translate(${margin + contentWidth},${margin})`}>
		  {color.domain().map((species, i) => {
			return <g
				key={i}
					 transform={`translate(0,${i * 30})`}
					 style={{ cursor: 'pointer' }}
					 onClick={() => {
				const newVisibility = new Set(visibility)
				if (visibility.has(species)) {
				  newVisibility.delete(species)
				} else {
				  newVisibility.add(species)
				}
				setVisibility(newVisibility)
			  }}
					 >
			  <rect width='10' height='10' fill={color(species)} />
			  <text x='15' y='10'>{species}</text>
			</g>
		  })}
		</g>
	  </svg>
	)
  }

  const App = () => {
	const variables = [
	  { label: 'Sepal Length', property: 'sepalLength' },
	  { label: 'Sepal Width', property: 'sepalWidth' },
	  { label: 'Petal Length', property: 'petalLength' },
	  { label: 'Petal Width', property: 'petalWidth' }
	]
	const [data, setData] = React.useState([])
	const [xProperty, setXProperty] = React.useState(variables[0])
	const [yProperty, setYProperty] = React.useState(variables[1])

	React.useEffect(() => {
	  fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json')
		.then((response) => response.json())
		.then((data) => {
		data.forEach((item, i) => {
		  item.id = i
		})
		  setData(data)
		})
	}, [])

	return (
	  <div className='container'>
		<div className='content'>
		  <h1>Scatter Plot of Iris Flower Dataset</h1>
		  <div className='field'>
			<label className='label'>Horizontal Axis</label>
			<div className='control'>
			  <div className='select'>
				<select
				  value={xProperty.property}
				  onChange={(event) => {
					setXProperty(variables.find((v) => v.property === event.target.value))
				  }}
				>
				  {variables.map((variable, i) => {
					return <option key={i} value={variable.property}>{variable.label}</option>
				  })}
				</select>
			  </div>
			</div>
		  </div>
		  <div className='field'>
			<label className='label'>Vertical Axis</label>
			<div className='control'>
			  <div className='select'>
				<select
				  value={yProperty.property}
				  onChange={(event) => {
					setYProperty(variables.find((v) => v.property === event.target.value))
				  }}
				>
				  {variables.map((variable, i) => {
					return <option key={i} value={variable.property}>{variable.label}</option>
				  })}
				</select>
			  </div>
			</div>
		  </div>
		  <div>
			<ScatterPlot
			  data={data}
			  margin={80}
			  contentWidth={400}
			  contentHeight={400}
			  xProperty={xProperty}
			  yProperty={yProperty}
			/>
		  </div>
		</div>
	  </div>
	)
  }

  ReactDOM.render(<App />, document.getElementById('root'))
