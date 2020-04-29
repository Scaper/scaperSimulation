import React from 'react';
import SVG from 'react-inlinesvg';

import './ProviderList.css';


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class ActivityList extends React.Component {

   render() {
      const counts = this.props.activities.map((alt) => {
         if(!alt.active || !alt.display) 
            return 0;
         else
         {
            var a = [alt]
            var value = this.props.countData(a)
            return value;
         }
      });
            
      const total = counts.reduce((x,y) => x+y);
      const share = counts.map((x) => {return (x+0.00001)/total});
      return(
         <>
             {
               this.props.activities.map((mode, i) => {
                  if(mode.display)
                  {
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
                        {mode.outname.charAt(0).toUpperCase() + mode.outname.substring(1)}
                     </span>
                     {

                        <span className="sub">
                           {
                              format
                           }
                        </span>
                     }

                  </div>
                  }
               })
            }
         </>
      )
   }
}

export default ActivityList;
