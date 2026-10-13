export const waterVertexShader = `
  varying vec3 vWorld;
  varying float vDist;
  uniform float uTime;
  uniform vec2 uRadius;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    float swell = sin(world.x * 0.05 + uTime * 0.4) * 0.16;
    swell += sin(world.z * 0.034 - uTime * 0.28) * 0.12;
    world.y += swell;
    vWorld = world.xyz;
    vDist = clamp(length(world.xz / uRadius), 0.0, 1.0);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const waterFragmentShader = `
  varying vec3 vWorld;
  varying float vDist;
  uniform vec3 uDeep;
  uniform vec3 uCoast;
  uniform vec3 uFoam;
  uniform vec3 uFogColor;
  uniform float uTime;
  uniform float uFogNear;
  uniform float uFogFar;

  void main() {
    float shore = smoothstep(0.48, 0.9, vDist);
    vec3 color = mix(uDeep, uCoast, shore);
    float band = sin(vWorld.z * 0.05 + uTime * 0.16);
    color = mix(color, uCoast, smoothstep(0.2, 0.9, band) * 0.2);
    float crest = pow(clamp(sin(vWorld.z * 0.062 + uTime * 0.18), 0.0, 1.0), 160.0);
    color = mix(color, uFoam, crest * 0.4);
    float depth = distance(cameraPosition, vWorld);
    float fogMix = smoothstep(uFogNear, uFogFar, depth);
    color = mix(color, uFogColor, fogMix * 0.65);
    gl_FragColor = vec4(color, 1.0);
  }
`
