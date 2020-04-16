import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = 'pk.eyJ1IjoidmlnaG5lc2hkZWVwMjAiLCJhIjoiY2s4ajU3OTR5MDJzNDNocjd0eG9vcG02MCJ9.fpfraPMqhDGWgskVdTn2oQ';

class Map2 extends React.Component {
  constructor(props) {
  super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 2
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    let response;
    try{
      response = await axios.get('https://corona.lmao.ninja/countries');
    }catch(e) {
      console.log('E', e);
      return;

    }
   
    const { data = [] } = response;
    const hasData = Array.isArray(data) && data.length > 0;

if ( !hasData ) return;

const geoJson = {
  type: 'FeatureCollection',
  features: data.map((country = {}) => {
    const { countryInfo = {} } = country;
    const { lat, long: lng } = countryInfo;
    return {
      type: 'Feature',
      properties: {
        ...country,
      },
      geometry: {
        type: 'Point',
        coordinates: [ lng, lat ]
      }
    }
  })
}

 function countryPointToLayer (feature = {}, latlng)  {
    const { properties = {} } = feature;
    let updatedFormatted;
    let casesString;

    const {
      country,
      updated,
      cases,
      deaths,
      recovered
    } = properties

    casesString = `${cases}`;

    if ( cases > 1000 ) {
      casesString = `${casesString.slice(0, -3)}k+`
    }

    if ( updated ) {
      updatedFormatted = new Date(updated).toLocaleString();
    }

    const html = `
      <span class="icon-marker">
        <span class="icon-marker-tooltip">
          <h2>${country}</h2>
          <ul>
            <li><strong>Confirmed:</strong> ${cases}</li>
            <li><strong>Deaths:</strong> ${deaths}</li>
            <li><strong>Recovered:</strong> ${recovered}</li>
            <li><strong>Last Update:</strong> ${updatedFormatted}</li>
          </ul>
        </span>
        ${ casesString }
      </span>
     `;
return L.marker( latlng, {
  icon: L.divIcon({
    className: 'icon',
      html
        }),
        riseOnHover: true
      });
    }
 
 
 const geoJsonLayers = new L.GeoJSON(geoJson,{
  pointToLayer: countryPointToLayer
});

geoJsonLayers.addTo(map);
    

  }

  render() {
    return (
      <div>
       <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.3.1/mapbox-gl.css' rel='stylesheet' />
        {/* <div className='sidebarStyle'>
          <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
        </div> */}
        <div style={{height: "92vh"}} ref={el => this.mapContainer = el} className='mapContainer' />
      </div>
    )
  }
}

export default Map2;

// ReactDOM.render(<Application />, document.getElementById('app'));

 
