import React from 'react';
import './BottomBar.css';
import * as d3 from "d3";

import Slider, { Range } from 'rc-slider';
import './Slider.css';
import './mybutton.css';

function addDays(date, days) {
   const result = new Date(date);
   result.setDate(result.getDate() + days);
   return result;
}

const Pause = ({onPlayerClick}) => {
   return (
      <button className="playbutton btn-icon">
    <div className="svgicon">
     <svg viewBox="0 0 60 60" onClick={onPlayerClick}>
       <polygon points="0,0 15,0 15,60 0,60" />
       <polygon points="25,0 40,0 40,60 25,60" />
     </svg>
    </div>

     </button>
   )
 }
 const Play = ({onPlayerClick}) => {
   return (
      <button className="playbutton btn-icon">
      <div className="svgicon">
       <svg viewBox="0 0 60 60" onClick={onPlayerClick}>
         <polygon points="0,0 50,30 0,60" />
       </svg>
       </div>
       </button>
   )
 }
class BottomBarSimulation extends React.Component {
   constructor(props) {
      super(props);
  
      this.state = {
         playing: true,
         speed:30,
         lastTimestamp:Date.now()/1000.0
      }
   }

    componentDidMount() {
      this._animate();
    }
  
    componentWillUnmount() {
      if (this._animationFrame) {
        window.cancelAnimationFrame(this._animationFrame);
      }
    }
   _animate() {   
        const timestamp = Date.now() / 1000.0;
        if(this.state.playing && this.state.speed > 0)
        {   
            const dt = (timestamp-this.state.lastTimestamp)*this.state.speed  
            const newtime = (this.props.time + dt - this.props.min) %(this.props.max - this.props.min) + this.props.min
            this.props.setTime(newtime)
        }
        this.setState({lastTimestamp:timestamp})

      this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }
   handlePlayerClick = () => {
      if (!this.state.playing) {
        this.setState({playing: true})
      } else {
        this.setState({playing: false})
      }
    }

   toDate = (time) =>
   {
       return new Date(0,0,0,0,0,time).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
   } 
   render() {
      return (
         <div style={{left: true}} className="bottom-bar">
            <div className="row" style={{marginLeft:'5px', marginRight:'5px'}}>
                <div className="column left">
                    <div className="date-row">
                        <div style={{width: '40px'}}>{this.toDate(this.props.time)}</div>
                    </div>
                    <div>            
                        {this.state.playing?  <Play onPlayerClick={this.handlePlayerClick} />: <Pause onPlayerClick={this.handlePlayerClick} />}
                    </div>
                </div>
            <div className="column right">            
                <div className="date-row">
                    <div style={{width: '40px'}}>{this.toDate(this.props.min)}</div>
                    <div style={{width: '40px'}}>{this.toDate(this.props.max)}</div>
                </div>
                {               
                  <div style={{marginLeft: '5px'}}>
                     <Slider
                        onChange={this.props.setTime}
                        min={this.props.min}
                        max={this.props.max}
                        defaultValue={this.props.min}
                        value={this.props.time}
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
            }
            </div>
            </div>
         </div>
      )
   }
}



export default BottomBarSimulation;
