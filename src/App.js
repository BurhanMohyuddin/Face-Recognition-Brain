import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js'; 
import 'tachyons';
import './App.css';

const particlesopt = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: '5d9a6a8d69b247c3ba233801965012cb'
 });


class App extends Component {
  constructor () {
    super();
    this.state = {
      input : '',
      imageurl: '',
      box: {},
      route : 'Signin',
      isSignIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageurl: this.state.input});
    
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'Signout') {
    this.setState({isSignIn: false});
    } else if (route === 'home')
    {
      this.setState({isSignIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignIn, imageurl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesopt} />
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} imageurl={imageurl} />
          </div>
          :
          (
            route === 'Signin' ?
              <Signin onRouteChange={this.onRouteChange} />
              :
              <Register onRouteChange={this.onRouteChange} />
          )

        }
      </div>
    );
  }
}

export default App;
