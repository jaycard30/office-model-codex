import * as THREE from 'https://unpkg.com/three@0.162.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b1f24);
scene.fog = new THREE.Fog(0x1b1f24, 28, 120);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 300);
camera.position.set(0, 1.7, 18);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);
const overlay = document.getElementById('overlay');
overlay.onclick = () => controls.lock();
controls.addEventListener('lock', () => overlay.style.display = 'none');
controls.addEventListener('unlock', () => overlay.style.display = 'grid');
scene.add(controls.getObject());

const hemi = new THREE.HemisphereLight(0xfff6de, 0x26303c, 0.32); scene.add(hemi);
const ambient = new THREE.AmbientLight(0xffe9c4, 0.18); scene.add(ambient);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(44, 34), new THREE.MeshStandardMaterial({ color: 0x4e5968, roughness: .9, metalness: .02 }));
floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);

function wall(x,z,w,h,d=0.25,c=0xd9d6cf){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:c,roughness:.95}));m.position.set(x,h/2,z);m.castShadow=m.receiveShadow=true;scene.add(m);return m;}
function desk(x,z,c=0x8a6e4f){const g=new THREE.Group();const t=new THREE.Mesh(new THREE.BoxGeometry(2.1,.08,1),new THREE.MeshStandardMaterial({color:c}));t.position.y=.76;const l=new THREE.BoxGeometry(.08,.75,.08);[-.95,.95].forEach(ix=>[-.45,.45].forEach(iz=>{const leg=new THREE.Mesh(l,new THREE.MeshStandardMaterial({color:0x444}));leg.position.set(ix,.375,iz);g.add(leg);}));g.add(t);g.position.set(x,0,z);scene.add(g);return g;}
function cubicle(x,z,w=2.7,d=2.2){wall(x-w/2,z,d,1.45,.06,0xbcb7ac).rotation.y=Math.PI/2;wall(x+w/2,z,d,1.45,.06,0xbcb7ac).rotation.y=Math.PI/2;wall(x,z-d/2,w,1.45,.06,0xc7c2b8)}
function propBox(x,y,z,w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color}));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;scene.add(m);return m;}
function warmLight(x,y,z,i=0.55){const l=new THREE.PointLight(0xffcf9e,i,13,2);l.position.set(x,y,z);l.castShadow=true;scene.add(l);}

// Perimeter and rooms
wall(0,-16,38,3); wall(0,16,38,3); wall(-22,0,32,3,.25); wall(22,0,32,3,.25);
wall(0,8.2,30,3); wall(-7.8,4.6,14,3,.2); wall(7.8,4.6,14,3,.2); // Michael/Conference
wall(15,3,9,3,.2); wall(15,-7,9,3,.2); // kitchen + annex split

// Bullpen desks
[[-7,0],[-4,0],[-1,0],[2,0],[5,0],[-5,-4],[-2,-4],[1,-4],[4,-4],[-6,4],[-3,4],[0,4],[3,4]].forEach(([x,z])=>desk(x,z));
[[-5,0],[-2,0],[1,0],[4,0],[-4,-4],[-1,-4],[2,-4],[-5,4],[-2,4],[1,4]].forEach(([x,z])=>cubicle(x,z));

// Reception
desk(11,11,0x7f6044); propBox(11.7,1.15,11.2,.35,.35,.35,0x79b3d8); // fish tank nod
propBox(10.5,.95,10.8,.45,.1,.3,0xd13f3f); // red candy/jelly beans bowl area

// Michael office
desk(-11,10.8,0x785639); propBox(-11.2,1.05,10.6,.5,.03,.35,0x111111); // nameplate
propBox(-10.3,1.2,11,.22,.4,.22,0x8f6138); // Dundee award silhouette

// Conference table
propBox(6.8,.78,10.2,5.5,.12,1.8,0x8b6747);
for(let i=0;i<8;i++) propBox(4.3+i*.7,.45,9.1,.4,.85,.4,0x2f333a);

// Kitchen/break room & annex nods
propBox(15,.9,8.7,2.1,1.8,.7,0xe9ecef); // fridge
propBox(13.3,.5,8.7,.7,1,.7,0xf1f1f1); // water cooler
propBox(15,.9,-6.7,2.8,.9,.8,0x6f737d); // copier
propBox(17,.8,-6.7,1.3,.7,.9,0x8f949e); // filing

// Iconic desk props: stapler-in-jello + bobblehead nod
propBox(-3.2,.92,.1,.2,.06,.1,0x333); // stapler
propBox(-3.2,.95,.1,.27,.16,.16,0xdc4c5d); // jello block
propBox(-1.7,.95,.2,.12,.2,.12,0xc6b07a); // bobble base
propBox(-1.7,1.12,.2,.1,.14,.1,0xf1d3a3); // bobble head

// Lighting array to avoid crushed/dim pockets
for (let x=-15;x<=15;x+=6) for (let z=-12;z<=12;z+=6) warmLight(x,2.7,z,0.33);
warmLight(11,2.3,11,.65); warmLight(-11,2.3,11,.58); warmLight(7,2.3,10,.55); warmLight(15,2.2,8,.52);

const move = {f:0,b:0,l:0,r:0,s:0}; let vel = new THREE.Vector3(); let canJump=true;
onkeydown = (e)=>{if(e.code==='KeyW')move.f=1; if(e.code==='KeyS')move.b=1; if(e.code==='KeyA')move.l=1; if(e.code==='KeyD')move.r=1; if(e.code==='ShiftLeft')move.s=1; if(e.code==='Space'&&canJump){vel.y=6;canJump=false;}};
onkeyup = (e)=>{if(e.code==='KeyW')move.f=0; if(e.code==='KeyS')move.b=0; if(e.code==='KeyA')move.l=0; if(e.code==='KeyD')move.r=0; if(e.code==='ShiftLeft')move.s=0;};
let t0 = performance.now();
function animate(t){
  requestAnimationFrame(animate);
  const dt=Math.min((t-t0)/1000,.033); t0=t;
  if(controls.isLocked){
    const speed=(move.s?8.5:4.8);
    vel.x += ((move.r-move.l)*speed - vel.x*7)*dt;
    vel.z += ((move.b-move.f)*speed - vel.z*7)*dt;
    vel.y -= 13*dt;
    controls.moveRight(vel.x*dt); controls.moveForward(vel.z*dt); camera.position.y += vel.y*dt;
    if(camera.position.y<1.7){vel.y=0;camera.position.y=1.7;canJump=true;}
    camera.position.x = THREE.MathUtils.clamp(camera.position.x,-20,20);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z,-15,15);
  }
  renderer.render(scene,camera);
}
animate(t0);
onresize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};
