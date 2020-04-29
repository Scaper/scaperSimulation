import React from 'react';
import SVG from 'react-inlinesvg';

import './ProviderList.css';

import CarIcon from 'svg-react-loader?name=Icon!../../../icons/car-11.svg';
import BikeIcon from 'svg-react-loader?name=Icon!../../../icons/bicycle-11.svg';
import BusIcon from 'svg-react-loader?name=Icon!../../../icons/bus.svg';
import WalkIcon from 'svg-react-loader?name=Icon!../../../icons/pedestrian-walking-svgrepo-com.svg';

//import carIcon from '../../icons/car-11.svg';
//import bikeIcon from '../../icons/bicycle-11.svg';
//import scooterIcon from '../../icons/bicycle-15.svg';

const icons = {
     car:  CarIcon,
     bike: BikeIcon,
     pt:   BusIcon,
     walk: WalkIcon
}

const units = {
   distance: 'miles',
   trips: 'trips',
   price: 'dollars'
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class ProviderList extends React.Component {


   render() {
      const counts = this.props.modes.map((mode) => {
         if(!mode.active)
            return 0;
         else
         {
         const filteredData = mode.data.filter(x => x.Timestamps[x.Timestamps.length-1]>this.props.t && x.Timestamps[0] < this.props.t);
         var value = filteredData.length;
         return value;
      }
      });      
      const total=counts.reduce((x,y) => x+y);
      const share = counts.map((x) => {return (x+0.00001)/total});
      //console.log(total);
      return(
         <>
            {
               

               this.props.modes.map((mode, i) => {

                  const style = {
                     background: mode.active ? mode.color : '#DBDBDB',
                     width: mode.active ?
                     share[i]*100 + '%' :
                     '0%'
                  };
                  var format = mode.active ? `${numberWithCommas(counts[i].toFixed(0))}` : '';
                  return <div
                        key={i}
                        className="provider"
                        onClick={() => this.props.handleClick(mode.name)}
                     >
                     <div style={style} className="line" />
                     <span style={{color: mode.active ? 'black' : '#737373'}} className="title">
                        {mode.name.charAt(0).toUpperCase() + mode.name.substring(1)}
                     </span>
                     {

                        <span className="sub">
                           {
                              format
                           }
                        </span>
                     }
                     <div className="icon-container">
                        {
                           mode.active &&
                           React.createElement(icons[mode.name], { className: 'normal', style: {height: '17px'} })
                        }
                        {
                           !mode.active &&
                           <span> </span>
                        }

                     </div>

                  </div>
               })
            }
         </>
      )
   }
}

export default ProviderList;
