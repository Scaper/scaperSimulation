import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer,ArcLayer, PolygonLayer} from '@deck.gl/layers';
import {LightingEffect, AmbientLight, _SunLight as SunLight} from '@deck.gl/core';
import {DataFilterExtension} from '@deck.gl/extensions';
import mathjs from 'mathjs'
import Button from './Components/Button/Button';
import Selector from './Components/Selector/Selector';
import Section from './Components/SidebarSection/Section'
import ActivityList from './Components/ProviderList/ActivityList';
import ProviderList from './Components/ProviderList/ProviderList';

import BottomBar from './Components/BottomBar/BottomBar';
import GridLabels from './Components/GridLabels/GridLabels';
import Sidebar from './Components/Sidebar/Sidebar';

import { activities } from './Configs/config2';
import { modes } from './Configs/config';
import { INITIAL_VIEW_STATE } from './Configs/viewstates';

import '../style.css';

import { create, all }  from 'mathjs';
const config = { };
const math = create(all, config);


// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1Ijoib3NrYXJiZyIsImEiOiJjazI0c29jbXQxOTFqM25ucjdybTZwZTNmIn0.nIJ6qTpnaA3xZIv5m5ievg'; // eslint-disable-line
import mapStyle from './mapboxstyle';

// Source data GeoJSON
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/geojson/vancouver-blocks.json'; // eslint-disable-line

//import emmedata from './emmeNoWaterEPSG4326.json';
import emmedata from '../data/emmeNoWaterEPSG4326_simple.json';
import tripsdata from '../data/trips_mode.json';
//import tripsdata from './trips.json';




const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 2.0
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 10),
  color: [255, 255, 255],
  intensity: 1.0,
  _shadow: true
});

const landCover = [[[19.7, 61.2], [15.5, 61.2], [15.5, 58], [19.7, 58]]];

const TIMESCALE = 60
export default class EmmeZoneLocationMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredObject: null,
      countlog : 0,
      activities : activities,
      modes : modes,
      countData : {},
      nUpdated : 0,
      data : tripsdata,
      sidebarOpen : true,
      minTimeBar: 3600*5,
      maxTimeBar: 3600*6,
      activeModes : this.getActive(modes),
      activeActivities : this.getActive(activities),
      nStarts : [],
      nEnds : [],
      bmounts: false
    };
    const lightingEffect = new LightingEffect({ambientLight, dirLight});
    lightingEffect.shadowColor = [0, 0, 0, 0.1];
    this._effects = [lightingEffect];
  }

  _onHover = ({x, y, object}) => {
    this.setState({x, y, hoveredObject: object});
  }
   calculateDensity = (countData) =>
   {
      var density = {}
      emmedata.features.forEach( x =>
        {
          var val = this.getHeight(countData,x,x.properties.AREA)
          var zone = x.properties.ID
          if(zone in density){
            density[zone] = density[zone]+val;
            }
          else
            density[zone] = val;
        })
      return density;
   }

   createD = (min,max) =>
   {
     var d = []
     modes.forEach(m => {
      d[m.name] = []
      activities.forEach(a => {
        d[m.name][a.name] = []
        for (var t = 0; t <= Math.round((max-min)/TIMESCALE); t+=1) {
           d[m.name][a.name][t] = new Int32Array(1240)
         }
       })
     })
     return d
   }
   /**
    * @desc creates a dictonary with counts for each mode, activity, time combination
    */
   createCountDictionary = (min,max,data) =>
   {
     
     var d00 = Date.now()
    console.log((Date.now()-d00)/1000)
    console.log("Create  dictionary")
    var d = this.createD(min,max)
var de = this.createD(min,max)
var d_sum_end = this.createD(min,max)
var d_sum_start = this.createD(min,max)
      console.log((Date.now()-d00)/1000)

     console.log("start writing tripsdata to dictionary")
     console.log(d)
     console.log(de)

     var count=0
      data.features.forEach(x => {
        count++;
        var m = x.mode
        var a = x.activity
        var l = x.location_idx
        var t_start = Math.round((x.starttime-min)/(TIMESCALE))
        var t_end = Math.round((x.endtime-min)/(TIMESCALE)) 
        d_sum_start[m][a][t_start][l+1] = d_sum_start[m][a][t_start][l+1] + 1
        d_sum_end[m][a][t_end][l+1] = d_sum_end[m][a][t_end][l+1] + 1

    //    for(var t = Math.round((x.starttime-min)/(TIMESCALE)); t<=(max-min)/(TIMESCALE); t+=1)
    //        d[m][a][t][l+1] = d[m][a][t][l+1] + 1
    //     for(var t = Math.round((x.endtime-min)/(TIMESCALE)); t<=(max-min)/(TIMESCALE); t+=1)
    //        de[m][a][t][l+1] = de[m][a][t][l+1] + 1
      });


      modes.forEach(mo => {
         var m = mo.name
         activities.forEach(ao => {
         var a = ao.name
         for(var l = 0; l<=1240; l++)
         {
           d[m][a][0][l] = d_sum_start[m][a][0][l]
           de[m][a][0][l] = d_sum_end[m][a][0][l]
         }
      for(var t = 1; t<=(max-min)/(TIMESCALE);t++)
      {
        var dtm = d[m][a][t-1]
        var dt =d[m][a][t]
        var dem = de[m][a][t-1]
        var det = de[m][a][t]

        var d_s_s_t = d_sum_start[m][a][t]
        var d_s_end_t= d_sum_end[m][a][t]
       for(var l = 0; l<=1240; l++)
       {
        //console.log(m + " " + a + " "+ t + " " + l)
       dt[l] = d_s_s_t[l] + dtm[l]
       det[l] = d_s_end_t[l] + dem[l]
       }
      }
      })
     })
    console.log((Date.now()-d00)/1000)
    console.log("finish writing tripsdata to dictionary")

    this.setState({nStarts : d})
    this.setState({nEnds : de})
   }

  countA = (activities_) => 
  {
    var [countData,totalCount] = this.countAllZones2(modes,activities_)
    return totalCount;
  }
  countM = (modes_) => 
  {
    var [countData,totalCount] = this.countAllZones2(modes_,activities)
    return totalCount;
  }

  countAllZones2 = (modes_,activities_) =>
  {
    var countData = new Int32Array(1240+1);
    var count = 0;
    var d = this.state.nStarts;
    var de = this.state.nEnds;
    var tmin = Math.round((this.state.minTimeBar-this.state.minTime)/TIMESCALE)
    var tmax = Math.round((this.state.maxTimeBar-this.state.minTime)/TIMESCALE)
    // console.log("aa")
    // console.log(tmin)
    // console.log(tmax)
    
    modes_.forEach(m => {
      if(m.active)
      {
          activities_.forEach(a => {
          if(a.active)
          {
            // for (var t = tmin; t <= tmax; t+=1) {
            //   {
                 var x = d[m.name][a.name][tmax]
                 var y = de[m.name][a.name][tmin]

                for(var l = 1; l<countData.length; l++)
                { 
                  countData[l] += x[l]-y[l]
                }
              //}
            }
          
        })
      }
    })
    for(var l = 1; l<countData.length; l++)
    { 
      count += countData[l]
    }
    return [countData,count];
  }
  countAllZones = (fFilter) =>
  {
    var countData = {};
    var count = 0;
    tripsdata.features.forEach((x) =>
    {
      var zone = x.location_emme;
      var val = fFilter(x); 
      count = count + val;
      if(zone in countData){
        countData[zone] = countData[zone]+val;
        }
      else
        countData[zone] = val;
    }
    )
    
    return [countData,count];
  }
  _countActivitiesInZone = (emmeZone) =>
  {
      return tripsdata.features.reduce((x,y) => x + (y.location_emme == emmeZone.properties.ZONE?1.0:0.0)*this.filterOnActiveActivity(y));
  }
  filterOnActiveMode = (y) =>
  {
    var outval = this.state.activeModes[y.mode] ? 1.0 : 0.0;
    return outval
  }
  filterOnActiveActivity = (y) =>
  {
    var outval = this.state.activeActivities[y.activity] ? 1.0 : 0.0;
    return outval
  }
  filterOnTime = (y) =>
  {
    //console.log(" start:" + y.starttime + " " + this.state.maxTimeBar)
    //console.log(" end:" + y.endtime + " " + this.state.minTimeBar)
    return (y.starttime <= this.state.maxTimeBar && y.endtime >= this.state.minTimeBar) ? 1.0 : 0.0;
  }
 hue2rgb = (p, q, t) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
 hslToRgb = (h, s, l) => {
    var r, g, b;
    l = l<1 ? l : 0.9999;
    l = 1-l; 
    if(s == 0){
        r = g = b = l; // achromatic
    } else if (l==1)
    {
      r = 0.8;
      g = 0.8;
      b = 0.8;
    } else{
         

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = this.hue2rgb(p, q, h + 1/3);
        g = this.hue2rgb(p, q, h);
        b = this.hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
getActive = (alternatives) => {
    var act = {}
    alternatives.map( x => {
      act[x.name] = x.active;
    })
    return act;
    //this.setState({activeActivities : act});
  }
  toggleAlternatives = (p,alternatives) => 
  {
    this.setState({nUpdated : this.state.nUpdated + 1})
    const alt = alternatives.map(x => {
      if (x.name === p) {
        x.active = !x.active;
      }
      return x;
    })
    return alt
  }
  toggleActivities = (p) => {
    var a = this.toggleAlternatives(p,this.state.activities)
    console.log("toggle")
    console.log(a)
    console.log(this.getActive(a))
    this.setState({
      activities: a,
      activeActivities : this.getActive(a)
    })
  }
  toggleModes = (p) => {
     var m = this.toggleAlternatives(p,this.state.modes)
    this.setState({
      modes: m,
      activeModes : this.getActive(m)
    })
  }
  componentWillMount = () =>
  {
    if(this.state.bmounts)
      return
    const min = Math.min.apply(null,
      this.state.data.features.map(x => x.starttime)
    );
    const max = Math.max.apply(null,
      this.state.data.features.map(x => x.endtime)
    );
    
    console.log(min)
    console.log(max)
    this.setState({
      minTime: min,
      maxDate: max
    })
    this.createCountDictionary(min,max,this.state.data)
    this.setState({bmounts:true})
  }
  getHeight = (countData,x,scale) =>
  {
    var zone = x.properties.ID;
    var val = zone in countData ? countData[zone]/scale : 0;
    return val;
  }
  setMinMaxTime = (evt) => {
    //console.log("min max time = ")
    //console.log(evt)
    this.setState({nUpdated : this.state.nUpdated+1}); 
    this.setState({
       minTimeBar: evt[0],
       maxTimeBar: evt[1]
    })
  }
  _renderLayers = () => {
    //this.onStartup()
    var d0 = Date.now()

    const {data = DATA_URL} = this.props;
    //var [countData2,totalCount2] =  this.countAllZones( (x) => (this.filterOnActiveActivity(x) * this.filterOnTime(x) * this.filterOnActiveMode(x)));
    var d1 = Date.now()
    if(!this.state.bmounts)
      return;
    var [countData,totalCount] = this.countAllZones2(modes,activities)


    // console.log(totalCount2)
    // console.log(totalCount)
    var density = this.calculateDensity(countData)
    //console.log(Date.now()-d2)

    var maxCount = Object.values(density).reduce((a, b) => a > b ? a: b);
    maxCount = maxCount == 0 ? 1 : maxCount;
     //console.log("render")
     //console.log(totalCount)
     //console.log(this.state.activeActivities)
     //console.log(this.state.activeModes)
         var d2 = Date.now()
    // console.log("t=")
    // console.log(d1-d0)
    //console.log(d2-d1)
    return [
      // only needed when using shadows - a plane for shadows to drop on
      
      new GeoJsonLayer({
        id: 'emme',
        data: emmedata,
        opacity: 0.7,
        stroked: true,
        wireframe: true,
        filled: true,
        extruded: true,
        getElevation: f => 0.1 +  Math.sqrt((this.getHeight(density,f,maxCount)))*10000,
        getLineWidth: 1,
        getFillColor: f => this.hslToRgb(0, 0.58, Math.sqrt(this.getHeight(density,f,maxCount))),
        getLineColor: [0,0,0],
        pickable: true,
        onHover:this._onHover,
        updateTriggers : {
          getElevation : this.state.nUpdated,
          getFillColor : this.state.nUpdated
        }
      })
    ];
  }

  _renderTooltip = () => {
    const {x, y, hoveredObject} = this.state;
    return (
      hoveredObject && (
        <div className="tooltip" style={{top: y, left: x}}>
          <div>
            <b>Area</b>
          </div>
            <div>{hoveredObject.properties.AREA} m<sup>2</sup></div>
          <div>
            <b>Emme id:</b>
          </div>
          <div>{hoveredObject.properties.ZONE}</div>
          <div>
            <b>idx:</b>
          </div>
          <div>{hoveredObject.properties.r_home_zone_idx}</div>
        </div>
      )
    );
  }
  getActivityNameData = (x) => {return x.activity}
  getModeNameData = (x) => {return x.mode}
  render() {
    const {mapStyle = 'mapbox://styles/mapbox/light-v9'} = this.props;
    const min = Math.min.apply(null,
      this.state.data.features.map(x => x.starttime)
    );
    const max = Math.max.apply(null,
      this.state.data.features.map(x => x.endtime)
    );
    return (
      <div>
        <Sidebar
          height={this.state.sidebarOpen ? "500px" : "102px"}
        >
          <Section>
            <ActivityList
              handleClick={this.toggleActivities}
              activities={this.state.activities}
              data={tripsdata}
              active={this.getActive(this.state.activities)}
              t={this.state.time}
              dataFilter={x => this.filterOnTime(x) * this.filterOnActiveMode(x)}
              countData ={this.countA}
              getNameData={this.getActivityNameData}
            />
          </Section>
          <Section>
            <ActivityList
              handleClick={this.toggleModes}
              activities={this.state.modes}
              data={tripsdata}
              active={this.getActive(this.state.modes)}
              t={this.state.time}
              dataFilter={x => this.filterOnTime(x) * this.filterOnActiveActivity(x)}
              countData ={this.countM}
              getNameData={this.getModeNameData}
            />
          </Section>
        </Sidebar>
        {

          <BottomBar
            left={this.state.sidebarOpen ? "calc(170px + 10px)" : "100vw"}
            data={this.state.data.features}
            currMin={this.state.minTimeBar}
            currMax={this.state.maxTimeBar}
            min = {min}
            max = {max}
            setMinMaxTime={this.setMinMaxTime}
            loaded = {true}
            histogramFilter = {x => this.filterOnActiveActivity(x)*this.filterOnActiveMode(x)}
            histogramGetX = {(x) => x.endtime }
            minmaxdistance = {50}
          />

        }
        <DeckGL
          layers={this._renderLayers()}
          effects={this._effects}
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}

        >
           <StaticMap
                reuseMaps
                mapStyle={mapStyle}
                preventStyleDiffing={true}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              />
          {this._renderTooltip}
        </DeckGL>
      </div>
    );
  }
}

export function renderToDOM(container) {
  render(<EmmeZoneLocationMap />, container);
}