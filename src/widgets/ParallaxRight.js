import React from 'react';
import {Parallax } from "react-scroll-parallax";
import { ParallaxProvider } from "react-scroll-parallax";

const Container = ({ children, scrollAxis, className }) => (
  <ParallaxProvider scrollAxis={scrollAxis}>
    <div className={scrollAxis}>
      <div className={className}>{children}</div>
    </div>
  </ParallaxProvider>
);


const ParallaxRight = () => {
     const args = {
        x1: '-120%,50%',
        x2: '-50%,-50%',
        x3: '-50%,-50%',
        y1: '50%,500%',
        y2: '20%,500%',
        y3: '1000%,500%',
      }
      const xa = args.x1.split(',');
      const xb = args.x2.split(',');
      const ya = args.y1.split(',');
      const yb = args.y2.split(',');
      return (
        <Container scrollAxis="vertical">
          <Parallax translateX={xa} translateY={ya} >
          <img width={"50px"} src='/memes/bome.jpeg' alt='xd'/>
          </Parallax>
          <Parallax translateX={xb} translateY={yb}>
          <img width={"120px"} src='/memes/dogwif.jpeg' alt='xd'/>
          </Parallax>
          <Parallax translateX={xa} translateY={ya} >
            <img width={"150px"} src='/memes/pepe.png' alt='xd'/>
          </Parallax>
        </Container>
      );
};

export default ParallaxRight;

