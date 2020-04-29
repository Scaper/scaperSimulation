import React from 'react';
import './BottomBar.css';
import * as d3 from "d3";

import { Range } from 'rc-slider';
import './Slider.css';

function addDays(date, days) {
   const result = new Date(date);
   result.setDate(result.getDate() + days);
   return result;
}

const Pause = ({onPlayerClick}) => {
   return (
      <button className="playbutton">
     <svg viewBox="0 0 60 60" onClick={onPlayerClick}>
       <polygon points="0,0 15,0 15,60 0,60" />
       <polygon points="25,0 40,0 40,60 25,60" />
     </svg>
     </button>
   )
 }
 const Play = ({onPlayerClick}) => {
   return (
      <button className="playbutton">
       <svg viewBox="0 0 60 60" onClick={onPlayerClick}>
         <polygon points="0,0 50,30 0,60" />
       </svg>
       </button>
   )
 }

 class Histogram extends React.Component {
    componentDidMount() {
       this.drawChart();
       window.addEventListener('resize', () => this.drawChart())
    }
    componentDidUpdate()
    {
      this.drawChart();
    }
   drawChart() {
      //console.log(data)

      document.getElementById('chart').innerHTML = ''
      const width = document.getElementById('chart').offsetWidth;


      let histogramData = this.props.data.filter(x => (this.props.histogramFilter(x) > 0.0)).map(x => this.props.getX(x))
      const start = this.props.min;
      const end = this.props.max;
      const margin = {
         top: 5,
         right: 0,
         bottom: 5,
         left: 0
      }
       const height = 80 - margin.top - margin.bottom;

       const x = d3.scaleTime().domain([
             start,
             end
       ]).rangeRound([0, width]);
       const y = d3.scaleLinear().range([height, 0]);

       const histogram = d3.histogram().value(function(d) {
          return d;
       }).domain(x.domain()).thresholds(x.ticks(
          30
       ));

      const svg = d3.select("#chart").append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom).append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const bins = histogram(histogramData);
      //console.log(bins)
      y.domain([
         0,
         d3.max(bins, function(d) {
            return d.length;
         })
      ]);

      svg.selectAll("rect").data(bins).enter().append("rect").attr("class", "bar").attr("x", 1).attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")";
         }).attr("width", function(d) {
            return x(d.x1) - x(d.x0) - 1 > 0 ? x(d.x1) - x(d.x0) - 1 : 0;
         })
         .attr("height", function(d) {
            return height - y(d.length);
         })
   }


   render() {
      //this.drawChart();

      return <div id="chart"></div>;

   }
   }

class BottomBar extends React.Component {
   constructor(props) {
      super(props);
  
      this.state = {
         playing: true,
         speed : 100
      }
   }
   componentDidMount() {

      //this.rotateCamera();
      this._animate();
    }
  
    componentWillUnmount() {
      if (this._animationFrame) {
        window.cancelAnimationFrame(this._animationFrame);
      }
    }
   _animate() {   
      var diff = this.props.currMax - this.props.currMin
      if(this.state.playing)
      {
      var currMin = this.props.currMin + this.state.speed
      var currMax = this.props.currMax + this.state.speed
      if(currMax > this.props.max)
      {
         currMin = this.props.min
         currMax = this.props.min + diff
      }
      this.props.setMinMaxTime([currMin,currMax])
      }
      this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }

    handlePlayerClick = () => {
      if (!this.state.playing) {
        this.setState({playing: true})
      } else {
        this.setState({playing: false})
      }
    }
   render() {
      const currMin = new Date(0,0,0,0,0,this.props.currMin);
      const currMax = new Date(0,0,0,0,0,this.props.currMax);
      //console.log(currMax)
      //console.log(currMin)
      return (
         <div style={{left: this.props.left}} className="bottom-bar">
            <div className="date-row">

               <div>{currMin.toLocaleTimeString()}</div>
               {this.state.playing?  <Play onPlayerClick={this.handlePlayerClick} />: <Pause onPlayerClick={this.handlePlayerClick} />}
               <div>{currMax.toLocaleTimeString()}</div>

            </div>
            {
               this.props.loaded &&
               <>
                  {/* <Histogram
                     data={this.props.data}
                     min={this.props.min}
                     max={this.props.max}
                     histogramFilter={this.props.histogramFilter}
                     getX={this.props.histogramGetX}
                  /> */}
                  <div style={{marginLeft: '5px'}}>
                     <Range
                        onChange={this.props.setMinMaxTime}
                        min={this.props.min}
                        max={this.props.max}
                        count={2}
                        defaultValue={[this.props.min, this.props.max]}
                        value={[this.props.currMin,this.props.currMax]}
                        allowCross={false}
                        pushable={this.props.minmaxdistance}
                        trackStyle={[{ backgroundColor: '#363636' }]}
                        handleStyle={[{
                           backgroundColor: 'black',
                           borderRadius: '0',
                           border: '0',
                           width: '8px',
                           padding: '0'
                        },
                        {
                           backgroundColor: 'black',
                           borderRadius: '0',
                           border: '0',
                           width: '8px',
                           padding: '0'
                        }]}
                        activeHandleStyle={[{
                           background: 'green'
                        }

                        ]}
                        railStyle={{ backgroundColor: '#D6D6D6' }}
                     />
                  </div>
               </>
            }
            {
               !this.props.loaded &&
               <div
                  style={{height: '100px'}}
               >

               </div>
            }




         </div>
      )
   }
}



export default BottomBar;
