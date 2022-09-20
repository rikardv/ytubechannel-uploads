import React, { Component } from 'react';
import weekdays from '../functions/weekdays';
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
  Cell,
} from 'recharts';

export default class chart extends Component {
  render() {
    return (
      <ResponsiveContainer width='100%' height={400}>
        <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid />
          <XAxis
            type='number'
            dataKey='days'
            name='Day of week'
            tickFormatter={weekdays}
            domain={[1, 7]}
            tickCount={7}
            allowDataOverflow
            padding={{ right: 50, left: 50 }}
          />
          <YAxis
            type='number'
            dataKey='hours'
            name='Time posted'
            domain={[0, 24]}
            tickCount={24}
            padding={{ top: 75, bottom: 75 }}
          />
          <ZAxis
            dataKey='quantity'
            name='Nr times last 100 uploads'
            range={[100, 5000]}
            stroke
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />

          <Scatter data={this.props.data}>
            {this.props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.quantity >= 2 ? '#61DBFB' : '#959595'}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
}
