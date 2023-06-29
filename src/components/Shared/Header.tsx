import React, { Component } from 'react';
import { IonHeader } from '@ionic/react';

import tellU from '../../images/tellU.png';
import tellU_white from '../../images/tellU_white.png';
import tellU_humboldt from '../../images/tellU_humboldt.png';
import tellU_humboldt_black from '../../images/tellU_humboldt_black.png';

import humboldtImage from '../../images/humboldt_school.png'
import berkeleyImage from '../../images/berkeley_school.png'

import '../../App.css';

export const ionHeaderStyle = {
  textAlign: 'center',
  padding: "2.5vh",
};

/**
 * tellU Header Component containing logo, school name, and (possible) background photo
 */
class TellUHeader extends Component<any, any>{
  render() {
    const dark: boolean = this.props.darkMode;
    const zoom: number = this.props.zoom;
    const colorPallete: boolean = this.props.colorPallete;
    let schoolStyle = {};
    let isHumboldt = false;
    let isBerkeley = false;
    schoolStyle = {
      fontWeight: "bold",
    }
    if (this.props.schoolName === 'Cal Poly Humboldt') {
      isHumboldt = true;
    } else if (this.props.schoolName === "UC Berkeley") {
      isBerkeley = true;
    }
    if (dark && isHumboldt && colorPallete) {
      return (
        <div style={{
          width: "100%",
        }}
        >
          <div style={{
            width: "100%",
            borderRadius: "10px",
            display: "inline-block",
            backgroundImage: `url(${humboldtImage})`,
            backgroundSize: '95vw',
            backgroundPosition: '10% -120%'
          }}>
            <IonHeader className="ion-no-border" style={{ textAlign: "center", top: "1vh" }}>
              <img
                draggable={false}
                className='quantum_logo'
                src={tellU_humboldt}
                alt="QUANTUM"
                style={{ zoom: zoom }}
              />
              <p style={schoolStyle}>{this.props.schoolName}</p>
            </IonHeader>
          </div>
        </div>
      )
    } else if (!dark && isHumboldt && colorPallete) {
      return (
        <div style={{
          width: "100%",
        }}
        >
          <div style={{
            width: "100%",
            bottom: "10vh",
            borderRadius: "10px",
            display: "inline-block",
            backgroundImage: `url(${humboldtImage})`,
            backgroundSize: '95vw',
            backgroundPosition: '10% -120%'
          }}>
            <IonHeader className="ion-no-border" style={{ textAlign: "center", top: "1vh" }}>
              <img
                draggable={false}
                className='quantum_logo'
                src={tellU_humboldt_black}
                alt="QUANTUM"
                style={{ zoom: zoom }}
              />
              <p style={schoolStyle}>{this.props.schoolName}</p>
            </IonHeader>
          </div>
        </div>
      )
    }
    else if (dark && isHumboldt && !colorPallete) {
      return (
        <div style={{
          width: "100%",
        }}
        >
          <div style={{
            width: "100%",
            borderRadius: "10px",
            display: "inline-block",
            backgroundImage: `url(${humboldtImage})`,
            backgroundSize: '95vw',
            backgroundPosition: '10% -120%'
          }}>
            <IonHeader className="ion-no-border" style={{ textAlign: "center", top: "1vh" }}>
              <img
                draggable={false}
                className='quantum_logo'
                src={tellU_white}
                alt="QUANTUM"
                style={{ zoom: zoom }}
              />
              <p style={schoolStyle}>{this.props.schoolName}</p>
            </IonHeader>
          </div>
        </div>
      )
    }
    else if (!dark && isHumboldt && !colorPallete) {
      return (
        <div style={{
          width: "100%",
        }}
        >
          <div style={{
            width: "100%",
            borderRadius: "10px",
            display: "inline-block",
            backgroundImage: `url(${humboldtImage})`,
            backgroundSize: '95vw',
            backgroundPosition: '10% -120%'
          }}>
            <IonHeader className="ion-no-border" style={{ textAlign: "center", top: "1vh" }}>
              <img
                draggable={false}
                className='quantum_logo'
                src={tellU}
                alt="QUANTUM"
                style={{ zoom: zoom }}
              />
              <p style={schoolStyle}>{this.props.schoolName}</p>
            </IonHeader>
          </div>
        </div>
      )
    }
    else if (dark && isBerkeley) {
      return (
        <div style={{
          width: "100%",
        }}
        >
          <div style={{
            width: "100%",
            borderRadius: "10px",
            display: "inline-block",
            backgroundImage: `url(${berkeleyImage})`,
            backgroundSize: '95vw',
            backgroundPosition: '10% -110%'
          }}>
            <IonHeader className="ion-no-border" style={{ textAlign: "center", top: "1vh" }}>
              <img
                draggable={false}
                className='quantum_logo'
                src={tellU_white}
                alt="QUANTUM"
                style={{ zoom: zoom }}
              />
              <p style={schoolStyle}>{this.props.schoolName}</p>
            </IonHeader>
          </div>
        </div>
      )
    }
    else if (!dark && isBerkeley) {
      return (
        <div style={{
          width: "100%",
        }}
        >
          <div style={{
            width: "100%",
            borderRadius: "10px",
            display: "inline-block",
            backgroundImage: `url(${berkeleyImage})`,
            backgroundSize: '95vw',
          }}>
            <IonHeader className="ion-no-border" style={{ textAlign: "center", top: "1vh" }}>
              <img
                draggable={false}
                className='quantum_logo'
                src={tellU}
                alt="QUANTUM"
                style={{ zoom: zoom }}
              />
              <p style={schoolStyle}>{this.props.schoolName}</p>
            </IonHeader>
          </div>
        </div>
      )
    }
    else if (dark) {
      return (
        <div style={{
          width: "100%",
        }}
        >
          <IonHeader className="ion-no-border" style={{ textAlign: "center", top: "1vh" }}>
            <img
              draggable={false}
              className='quantum_logo'
              src={tellU_white}
              alt="QUANTUM"
              style={{ zoom: zoom, height: "50px" }}
            />
            <p style={schoolStyle}>{this.props.schoolName}</p>
          </IonHeader>
        </div>
      )
    }
    else {
      return (
        <div style={{
          width: "100%",
        }}
        >
          <IonHeader className="ion-no-border" style={{ textAlign: "center", top: "1vh" }}>
            <img
              draggable={false}
              className='quantum_logo'
              src={tellU}
              alt="QUANTUM"
              style={{ zoom: zoom, height: "50px" }}
            />
            <p style={schoolStyle}>{this.props.schoolName}</p>
          </IonHeader>
        </div>
      )
    }
  }
}

export default React.memo(TellUHeader);