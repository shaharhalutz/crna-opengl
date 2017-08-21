import React, { Component } from 'react';
import { Shaders, Node, GLSL } from 'gl-react'; // 3.9.0
import { Surface } from 'gl-react-expo'; // 3.9.0



const shaders = Shaders.create({
  gradients: { frag: GLSL`
precision highp float;
varying vec2 uv;
uniform vec4 colors[3];
uniform vec2 particles[3];
void main () {
  vec4 sum = vec4(0.0);
  for (int i=0; i<3; i++) {
    vec4 c = colors[i];
    vec2 p = particles[i];
    float d = c.a * smoothstep(0.6, 0.2, distance(p, uv));
    sum += d * vec4(c.a * c.rgb, c.a);
  }
  if (sum.a > 1.0) {
    sum.rgb /= sum.a;
    sum.a = 1.0;
  }
  gl_FragColor = vec4(sum.a * sum.rgb, 1.0);
}
`}
});

// Alternative syntax using React stateless function component
const Gradients = ({ time }) => (
  <Node
    shader={shaders.gradients}
    uniforms={{
      colors: [
        [Math.cos(0.002 * time), Math.sin(0.002 * time), 0.2, 1],
        [Math.sin(0.002 * time), -Math.cos(0.002 * time), 0.1, 1],
        [0.3, Math.sin(3 + 0.002 * time), Math.cos(1 + 0.003 * time), 1],
      ],
      particles: [[0.3, 0.3], [0.7, 0.5], [0.4, 0.9]],
    }}
  />
);

const GradientsLoop = timeLoop(Gradients);

export default class App extends Component {
  render() {
    console.log(JSON.stringify(GradientsLoop))
    console.log(JSON.stringify(Gradients))
    return (
      <Surface style={{ width: 200, height: 200 }}>
         <GradientsLoop/>
      </Surface>
    );
    // Surface creates the canvas, an area of pixels where you can draw.
    // Node instanciates a "shader program" with the fragment shader defined above.
  }
}

//@flow
import timeLoop from "./timeLoop";

import { PureComponent } from 'react';
import raf from 'raf'; // 3.3.2
import hoistNonReactStatics from 'hoist-non-react-statics'; // 1.2.0

// NB this is only an utility for the examples
