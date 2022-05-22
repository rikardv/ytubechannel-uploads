import React, { Component } from 'react';
import weekdays from './functions/weekdays';
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

export default class chart extends Component {

    render() {
      return (
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 0, right: 20, bottom: 0, left: 20}} >
           <CartesianGrid />
           <XAxis type="number" dataKey="days" name="Veckodag" tickFormatter={weekdays} domain={[1,7]} tickCount={7}/>
           <YAxis type="number" dataKey="hours" name="Tidpunkt dagen" domain={[0,24]} tickCount={24}/>
           <ZAxis dataKey="quantity" name="Antal ggr senaste 20 uppladningarna" range={[500,1000]} stroke/>
           <Tooltip cursor={{ strokeDasharray: '3 3' }} />
           <Legend/>
           <Scatter data={this.props.data} fill="#61DBFB" />
        </ScatterChart>
      </ResponsiveContainer>

        )
    }
}
