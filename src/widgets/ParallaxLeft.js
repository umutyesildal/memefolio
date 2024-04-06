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


const ParallaxLeft = () => {
     const args = {
        x1: '120%,50%',
        x2: '50%,200%',
        x3: '50%,-50%',
        y1: '20%,500%',
        y2: '10%,500%',
        y3: '70%,500%',
      }
      const xa = args.x1.split(',');
      const xb = args.x2.split(',');
      const ya = args.y1.split(',');
      const yb = args.y2.split(',');
      return (
        <Container scrollAxis="vertical">
          <Parallax translateX={xa} translateY={ya} >
          <img width={"50px"} src='/memes/mew.jpeg' alt='xd'/>
          </Parallax>
          <Parallax translateX={xb} translateY={yb}>
          <img width={"100px"} src='/memes/wen.jpeg' alt='xd'/>
          </Parallax>
          <Parallax  translateX={xa} translateY={ya} >
            <img width={"80px"} src='/memes/bonkbot.jpeg' alt='xd'/>
          </Parallax>
        </Container>
      );
};

export default ParallaxLeft;

