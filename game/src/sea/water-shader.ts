export const waterVertexShader = `
  varying vec3 vWorld;
  uniform float uTime;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    float swell = sin(world.x * 0.045 + uTime * 0.35) * 0.1;
    swell += sin(world.z * 0.031 - uTime * 0.22) * 0.07;
    world.y += swell;
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const waterFragmentShader = `
  varying vec3 vWorld;
  uniform vec3 uDeep;
  uniform vec3 uCoast;
  uniform vec3 uFogColor;
  uniform vec2 uRadius;
  uniform float uTime;
  uniform float uFogNear;
  uniform float uFogFar;

  void main() {
    vec2 oval = vWorld.xz / uRadius;
    float dist = clamp(length(oval), 0.0, 1.0);
    float shore = smoothstep(0.62, 0.98, dist);
    vec3 color = mix(uDeep, uCoast, shore);
    float ripple = sin(vWorld.x * 0.05 + uTime * 0.2) * sin(vWorld.z * 0.04 - uTime * 0.16);
    color = mix(color, uCoast, (0.5 + 0.5 * ripple) * 0.06);
    float depth = distance(cameraPosition, vWorld);
    float fogMix = smoothstep(uFogNear, uFogFar, depth);
    color = mix(color, uFogColor, fogMix * 0.28);
    gl_FragColor = vec4(color, 1.0);
  }
`
