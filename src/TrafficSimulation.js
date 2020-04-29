/* global window */
import React, { Component } from 'react';
import { render } from 'react-dom';
import { StaticMap, FlyToInterpolator } from 'react-map-gl';
import { PhongMaterial } from '@luma.gl/core';
import { AmbientLight, PointLight, LightingEffect, Layer, LinearInterpolator } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { PolygonLayer, PathLayer, ArcLayer, TextLayer, ScatterplotLayer, PointCloudLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';


import Button from './Components/Button/Button';
import Selector from './Components/Selector/Selector';
import Section from './Components/SidebarSection/Section'
import ProviderList from './Components/ProviderList/ProviderList';
import ActivityList from './Components/ProviderList/ActivityList';

import BottomBarSimulation from './Components/BottomBar/BottomBarSimulation';
import GridLabels from './Components/GridLabels/GridLabels';
import Sidebar from './Components/Sidebar/Sidebar';


import { modes } from './Configs/config';
import '../style.css';

import {data} from '../data/config_50000'

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1Ijoib3NrYXJiZyIsImEiOiJjazI0c29jbXQxOTFqM25ucjdybTZwZTNmIn0.nIJ6qTpnaA3xZIv5m5ievg'; // eslint-disable-line
import mapStyle from './mapboxstyle';


const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
};
const INITIAL_VIEW_STATE = {
  longitude: 18.0,
  latitude: 59.3,
  zoom: 10,
  pitch: 10,
  bearing: 0
};


export default class SimulationApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 7*3600,
      timeInterval: [5*3600,22*3600],
      sidebarOpen:true
    }; 
  }
  setTime = (time) =>
  {
      this.setState({time:time})
  }


    _renderLayers() {
    var layers = []
    var count=0
    for(var didx in data)
    {
        var d = data[didx]
        if(d.tmin<this.state.time && d.tmax > this.state.time)
        {
            count++
            var triplayer = new TripsLayer({
                id: 'trips' + didx,
                data: {
                    length: data[didx].idx.length,
                    startIndices: data[didx].idx,
                    attributes: {
                        getPath: {value: data[didx].Positions, size:2},
                        getTimestamps: {value: data[didx].Timestamps, size:1}
                    }
                },
                _pathType: 'open',
                currentTime: this.state.time,
                widthMinPixels:2,
                rounded:true,
                trailLength: 10,
            })
            layers.push(triplayer);
        }
    }
    //console.log(`t=${Math.round(this.state.time/3600,2)} count=${count}`)
    return layers;
  }

  render() {
    const {
      
      viewState
    } = this.state;
    const theme = DEFAULT_THEME;
    return (
      <>
          <div>
{
          <BottomBarSimulation
            left={this.state.sidebarOpen ? "calc(170px + 10px)" : "100vw"}
            time={this.state.time}
            min = {this.state.timeInterval[0]}
            max = {this.state.timeInterval[1]}
            setTime={this.setTime}
            />
        }

            <DeckGL
              layers={this._renderLayers()}
              effects={theme.effects}
              initialViewState={INITIAL_VIEW_STATE}
              controller={true}
            >
              <StaticMap
                reuseMaps
                mapStyle={mapStyle}
                preventStyleDiffing={true}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              />
            </DeckGL>
          </div>
      </>
    );


  }
}
{/* */ }
export function renderToDOM(container) {
  render(<Pathtestlayer />, container);
}
