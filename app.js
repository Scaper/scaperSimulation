import React, {Component} from 'react';
import {render} from 'react-dom';
import EmmeZoneLocationMap from './src/EmmeZoneLocationMap'
import TrafficSimulation from './src/TrafficSimulation'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { create, all }  from 'mathjs';



import './style.css';
//const carData  = import('./carmovements.json');
//import tt from './testjson.json'

const config = { };
const math = create(all, config);

export default class App extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            show: "Covid19Bubles",
            count:0
        }
    }
    
    getToShow = () => 
    {
        if (this.state.show=="home")
        {

            var m = new Int32Array(6);
            m[2] = this.state.count;
            console.log(m)
            return <div>{m} </div>
            //return <div>home </div>
            
        }
        else if(this.state.show=="locationChoice")
        {
            return <EmmeZoneLocationMap/>
        }
        else if(this.state.show=="trafficSimulation")
        {
            return <TrafficSimulation/>
        }
    } 
    buttonclick = (clicked) =>
    {
        this.setState({count:this.state.count+1})

        console.log("click button")
        console.log(this.state.show)
        console.log(clicked)

        this.setState({show: clicked})
    }
    render() {

        const style = {
            zindex: 100000000
         };
//          <Button onClick={() => this.buttonclick() }>Toggle</Button>

        return (

<div>
    <div className="topbutton">
        <Navbar className="mynavbar" bg="dark" variant="dark" fixed="top">
            <Navbar.Brand className="mybrand" href="#">Scaper</Navbar.Brand>
            <Nav className="mr-auto mynav">
                <Nav.Link className="mynavlink" onClick={() => this.buttonclick("home")}>Home</Nav.Link>
                <Nav.Link className="mynavlink" onClick={() => this.buttonclick("locationChoice")}>Location choices</Nav.Link>
                <Nav.Link className="mynavlink" onClick={() => this.buttonclick("trafficSimulation")}>Traffic Simulation</Nav.Link>

            </Nav>
        </Navbar>
    </div>
    <div className="gallery-wrapper">
        <div className="fullheight">
         {
             this.getToShow()
         }
         </div>
    </div>
</div>   
    )
}
}
export function renderToDOM(container) {
    render(<App />, container);
  }
