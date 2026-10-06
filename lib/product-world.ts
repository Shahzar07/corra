import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type {ProductMotion} from './product-choreography';

export type ProductWorld={draw:(motion:ProductMotion,width:number,height:number)=>void;dispose:()=>void};

// Geometry follows the supplied artwork's alpha silhouette. UV coordinates refer
// directly to the original PNG; no logo, label or nutritional value is recreated.
export function createPouch(texture: THREE.Texture, grain:THREE.Texture) {
  const image = texture.image as HTMLImageElement;
  const sampler = document.createElement('canvas');
  sampler.width = image.naturalWidth;
  sampler.height = image.naturalHeight;
  const context = sampler.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Product artwork could not be read.');
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, sampler.width, sampler.height);
  const columns = 40;
  const rows = 64;
  const bounds = { x: 395, y: 212, width: 685, height: 1040 };
  const positions: number[] = [];
  const backPositions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const scale = 3.15 / bounds.width;

  for (let row = 0; row <= rows; row++) {
    const sourceY = bounds.y + bounds.height * (1 - row / rows);
    const pixelY = Math.round(sourceY);
    let min = image.naturalWidth;
    let max = 0;
    for (let x = bounds.x; x <= bounds.x + bounds.width; x++) {
      if (data[(pixelY * image.naturalWidth + x) * 4 + 3] > 150) {
        min = Math.min(min, x);
        max = Math.max(max, x);
      }
    }
    if (min >= max) { min = bounds.x + 6; max = bounds.x + bounds.width - 6; }
    const v = row / rows;
    const fullness = Math.sin(Math.PI * Math.min(.95, v * .91 + .035));
    const seam = THREE.MathUtils.smoothstep(v, .84, .96);
    const depth = .48 * fullness * (1 - seam) + .018;
    for (let column = 0; column <= columns; column++) {
      const u = column / columns;
      const sourceX = THREE.MathUtils.lerp(min, max, u);
      const x = (sourceX - (bounds.x + bounds.width / 2)) * scale;
      const y = (v - .5) * 4.9;
      const edge = 1 - Math.pow(Math.abs(u - .5) * 2, 3);
      const crease = Math.sin(v*38+u*7)*.018*Math.pow(Math.abs(u-.5)*2,4)*(1-seam);
      const z = .013 + depth * edge + crease;
      positions.push(x, y, z);
      backPositions.push(x, y, -z);
      uvs.push(sourceX / image.naturalWidth, 1 - sourceY / image.naturalHeight);
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column;
        const b = a + columns + 1;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  const front = new THREE.BufferGeometry();
  front.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  front.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  front.setIndex(indices);
  front.computeVertexNormals();
  const back = new THREE.BufferGeometry();
  back.setAttribute('position', new THREE.Float32BufferAttribute(backPositions, 3));
  back.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  const backIndices: number[] = [];
  for (let i = 0; i < indices.length; i += 3) backIndices.push(indices[i], indices[i + 2], indices[i + 1]);
  back.setIndex(backIndices);
  back.computeVertexNormals();

  const rimPositions: number[] = [];
  const rimIndices: number[] = [];
  function rimVertex(index: number) {
    const x = positions[index * 3];
    const y = positions[index * 3 + 1];
    const z = positions[index * 3 + 2];
    rimPositions.push(x, y, z, x, y, -z);
  }
  const boundary: number[] = [];
  for (let row = 0; row <= rows; row++) boundary.push(row * (columns + 1));
  for (let col = 1; col <= columns; col++) boundary.push(rows * (columns + 1) + col);
  for (let row = rows - 1; row >= 0; row--) boundary.push(row * (columns + 1) + columns);
  for (let col = columns - 1; col >= 1; col--) boundary.push(col);
  boundary.forEach(rimVertex);
  rimVertex(boundary[0]);
  for (let i = 0; i < boundary.length; i++) {
    const a = i * 2;
    rimIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const rim = new THREE.BufferGeometry();
  rim.setAttribute('position', new THREE.Float32BufferAttribute(rimPositions, 3));
  const rimUvs:number[]=[];
  for(let i=0;i<=boundary.length;i++)rimUvs.push(i/boundary.length,0,i/boundary.length,1);
  rim.setAttribute('uv',new THREE.Float32BufferAttribute(rimUvs,2));
  rim.setIndex(rimIndices);
  rim.computeVertexNormals();

  // Original artwork is printed onto a lit, gently inflated matte surface.
  // The sealed rear and gusset have real depth and retain the pouch silhouette.
  const artwork = new THREE.MeshPhysicalMaterial({map:texture,alphaTest:.12,roughness:.82,metalness:0,clearcoat:.08,clearcoatRoughness:.72,bumpMap:grain,bumpScale:.009,envMapIntensity:.45,emissiveMap:texture,emissive:'#ffffff',emissiveIntensity:.12});
  const matte = new THREE.MeshPhysicalMaterial({color:'#eee5d9',roughness:.86,clearcoat:.04,bumpMap:grain,bumpScale:.008,side:THREE.DoubleSide,envMapIntensity:.45});
  const group = new THREE.Group();
  group.add(new THREE.Mesh(front, artwork), new THREE.Mesh(back, matte), new THREE.Mesh(rim, matte));
  return group;
}


function createGrain(){
  const size=64,data=new Uint8Array(size*size*4);
  let seed=17;
  for(let i=0;i<size*size;i++){
    seed=(seed*1664525+1013904223)>>>0;
    const value=120+(seed>>>27);
    data.set([value,value,value,255],i*4);
  }
  const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(6,9);texture.needsUpdate=true;
  return texture;
}

function createShadow(){
  return new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,
    uniforms:{strength:{value:.13}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'varying vec2 vUv;uniform float strength;void main(){vec2 p=(vUv-.5)*2.;float a=exp(-dot(p,p)*3.8)*strength*(1.-smoothstep(.4,1.,length(p)));gl_FragColor=vec4(.24,.12,.08,a);}',
  }));
}

function createRibbon(color:string,offset:number){
  const positions:number[]=[],indices:number[]=[];
  const steps=160;
  for(let i=0;i<=steps;i++){
    const t=i/steps*Math.PI*2;
    const x=Math.cos(t)*2.65,y=Math.sin(t)*2.30,z=Math.sin(t*2+offset)*.34;
    const twist=Math.sin(t+offset)*.36;
    for(const side of [-1,1])positions.push(x+Math.cos(t)*side*.095,y+Math.sin(t)*side*.095,z+side*twist*.095);
    if(i<steps){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2)}
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setIndex(indices);geometry.computeVertexNormals();
  return new THREE.Mesh(geometry,new THREE.MeshPhysicalMaterial({color,side:THREE.DoubleSide,roughness:.55,clearcoat:.1,envMapIntensity:.5}));
}

export async function createProductWorld(host:HTMLElement,options:{signal:AbortSignal;onContextLost:()=>void}):Promise<ProductWorld>{
  const canvas=document.createElement('canvas');
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'high-performance'});
  if(!gl)throw new Error('Use the product artwork fallback.');
  const renderer=new THREE.WebGLRenderer({canvas,context:gl,alpha:true,antialias:true});
  renderer.setClearColor(0,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.NoToneMapping;
  canvas.setAttribute('aria-hidden','true');
  host.appendChild(canvas);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(36,1,.1,60);
  camera.position.set(0,0,15);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const room=new RoomEnvironment();
  let environment:THREE.WebGLRenderTarget;
  try{environment=pmrem.fromScene(room,.04,.1,80)}
  catch(error){room.dispose();pmrem.dispose();renderer.dispose();canvas.remove();throw error}
  scene.environment=environment.texture;
  scene.environmentIntensity=.55;
  room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight('#fffaf3','#d7bcb0',.75));
  const key=new THREE.DirectionalLight('#fffaf4',3.0);key.position.set(-4,6,9);scene.add(key);
  const fill=new THREE.DirectionalLight('#fff5ef',.75);fill.position.set(7,1,6);scene.add(fill);
  const edge=new THREE.DirectionalLight('#f7dfd1',1.2);edge.position.set(2,4,-5);scene.add(edge);
  const textures:THREE.Texture[]=[];
  const grain=createGrain();textures.push(grain);
  const packets:THREE.Group[]=[];
  const shadows=[createShadow(),createShadow()];shadows.forEach(shadow=>scene.add(shadow));
  const orbit=new THREE.Group();
  orbit.add(createRibbon('#F95006',0),createRibbon('#6B1D57',1.7));
  orbit.children[1].rotation.set(.16,.22,.30);
  orbit.children[1].scale.setScalar(1.13);
  scene.add(orbit);
  let disposed=false,lastWidth=0,lastHeight=0;
  function dispose(){
    if(disposed)return;disposed=true;
    options.signal.removeEventListener('abort',dispose);
    canvas.removeEventListener('webglcontextlost',contextLost);
    scene.traverse(object=>{
      if(object instanceof THREE.Mesh){
        object.geometry.dispose();
        (Array.isArray(object.material)?object.material:[object.material]).forEach(material=>material.dispose());
      }
    });
    textures.forEach(texture=>texture.dispose());environment.dispose();renderer.dispose();canvas.remove();
  }
  function contextLost(event:Event){event.preventDefault();dispose();options.onContextLost()}
  canvas.addEventListener('webglcontextlost',contextLost);
  options.signal.addEventListener('abort',dispose,{once:true});
  if(options.signal.aborted){dispose();throw new Error('Product scene cancelled.')}
  function draw(motion:ProductMotion,width:number,height:number){
    if(disposed||!width||!height)return;
    const mobile=width<900;
    if(width!==lastWidth||height!==lastHeight){
      lastWidth=width;lastHeight=height;
      camera.aspect=width/height;camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1.25:1.5,Math.sqrt(2800000/(width*height))));
      renderer.setSize(width,height);
    }
    const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    motion.packets.forEach((pose,index)=>{
      const viewHeight=2*(camera.position.z-pose.depth)*tan;
      const packet=packets[index];
      packet.position.set((pose.x-.5)*viewHeight*camera.aspect,(.5-pose.y)*viewHeight,pose.depth);
      packet.scale.setScalar(pose.height*viewHeight/4.9);
      packet.rotation.set(THREE.MathUtils.degToRad(pose.rx),THREE.MathUtils.degToRad(pose.ry),THREE.MathUtils.degToRad(pose.rz));
      const shadowHeight=2*(camera.position.z+2)*tan;
      const shadow=shadows[index];
      shadow.position.set((pose.x-.5)*shadowHeight*camera.aspect,(.5-pose.y-pose.height*.55)*shadowHeight,-2);
      shadow.scale.set(pose.height*shadowHeight*.92,shadowHeight*.05,1);
      shadow.material.uniforms.strength.value=.08+pose.height*.08;
    });
    const view=2*(camera.position.z+2.7)*tan;
    orbit.position.set((motion.framing==='gallery'?.5:mobile?.5:.76)-.5,0,-2.7);
    orbit.position.x*=view*camera.aspect;
    orbit.position.y=(.5-(motion.framing==='gallery'?.52:mobile?.76:.52))*view;
    orbit.scale.setScalar(view*(motion.framing==='gallery'?.63:mobile?.38:.65)/9.75);
    orbit.rotation.set(.40+motion.phone*.15,-.12,motion.orbit);
    renderer.render(scene,camera);
  }
  try{
    const loader=new THREE.TextureLoader();
    const loaded=await Promise.all(['/images/follicular-original.png','/images/pouch-reference.png'].map(async url=>{
      const texture=await loader.loadAsync(url);textures.push(texture);
      if(disposed)texture.dispose();return texture;
    }));
    if(disposed)throw new Error('Product scene cancelled.');
    loaded.forEach(texture=>{
      texture.colorSpace=THREE.SRGBColorSpace;
      texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      const packet=createPouch(texture,grain);packets.push(packet);scene.add(packet);
    });
    await renderer.compileAsync(scene,camera);
    if(disposed)throw new Error('Product scene cancelled.');
    return {draw,dispose};
  }catch(error){dispose();throw error}
}
