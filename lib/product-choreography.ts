/** Shared by the WebGL scene and its artwork fallback. Coordinates are screen
 * fractions, so changing renderer never changes the product composition. */
export type PacketPose = { x:number; y:number; height:number; depth:number; rx:number; ry:number; rz:number };
export type ProductMotion = { packets:[PacketPose,PacketPose]; orbit:number; phone:number; framing?:'gallery' };
export const STORY_STOPS = [0,.36,.64,.94] as const;
export const STORY_LABELS = ['The set','Follicular','Luteal','The app'] as const;

const pose=(x:number,y:number,height:number,depth:number,rx:number,ry:number,rz:number):PacketPose=>({x,y,height,depth,rx,ry,rz});
const frames:{at:number;packets:[PacketPose,PacketPose];orbit:number;phone:number}[]=[
  {at:0,packets:[pose(.66,.45,.57,.6,-4,-16,-10),pose(.84,.51,.51,-1.6,4,18,11)],orbit:-.18,phone:0},
  {at:.17,packets:[pose(.66,.45,.57,.6,-4,-16,-10),pose(.84,.51,.51,-1.6,4,18,11)],orbit:-.18,phone:0},
  {at:.30,packets:[pose(.76,.46,.70,.8,-3,-10,-4),pose(.91,.60,.28,-1.7,8,58,16)],orbit:.34,phone:0},
  {at:.43,packets:[pose(.76,.46,.70,.8,-3,-10,-4),pose(.91,.60,.28,-1.7,8,58,16)],orbit:.34,phone:0},
  {at:.49,packets:[pose(.61,.30,.40,-1.7,-13,-48,-12),pose(.89,.69,.40,.8,13,34,12)],orbit:.68,phone:0},
  {at:.58,packets:[pose(.58,.61,.27,-1.7,6,-55,-16),pose(.77,.46,.70,.8,-3,12,4)],orbit:1.02,phone:0},
  {at:.71,packets:[pose(.58,.61,.27,-1.7,6,-55,-16),pose(.77,.46,.70,.8,-3,12,4)],orbit:1.02,phone:0},
  {at:.87,packets:[pose(.58,.50,.37,-.1,-2,-18,-6),pose(.91,.54,.35,-.3,2,20,6)],orbit:1.47,phone:1},
  {at:1,packets:[pose(.58,.50,.37,-.1,-2,-18,-6),pose(.91,.54,.35,-.3,2,20,6)],orbit:1.47,phone:1},
];

export function chapterForProgress(progress:number){return progress<.245?0:progress<.515?1:progress<.805?2:3}
export function smootherstep(value:number){const t=Math.min(1,Math.max(0,value));return t*t*t*(t*(t*6-15)+10)}

export function sampleProductMotion(progress:number,mobile=false):ProductMotion {
  const p=Math.min(1,Math.max(0,progress));
  let index=0;
  while(index<frames.length-2&&p>frames[index+1].at)index++;
  const a=frames[index],b=frames[index+1];
  const t=smootherstep((p-a.at)/(b.at-a.at));
  const mix=(from:number,to:number)=>from+(to-from)*t;
  const packets=a.packets.map((start,i)=>{
    const end=b.packets[i];
    const result=Object.fromEntries(Object.keys(start).map(key=>[key,mix(start[key as keyof PacketPose],end[key as keyof PacketPose])])) as PacketPose;
    if(mobile){
      // Same choreography in a portrait composition. The app's small packets
      // move aside to leave a clear central phone silhouette.
      const focus=(result.height-.27)/(.70-.27);
      const connected=mix(a.phone,b.phone);
      result.x=i===0?mixMobile(.16+.40*focus,.12,connected):mixMobile(.85-.28*focus,.89,connected);
      const setBlend=1-smootherstep(Math.min(p/.30,1));
      result.x=mixMobile(result.x,i===0?.37:.69,setBlend);
      result.y=mixMobile(.79-.04*focus,.745,connected);
      result.y=mixMobile(result.y,i===0?.73:.77,setBlend);
      result.height=mixMobile(.16+.18*focus,.16,connected);
      result.height=mixMobile(result.height,i===0?.30:.29,setBlend);
      const swapArc=smootherstep((p-.43)/.04)*(1-smootherstep((p-.51)/.07));
      result.x+=(i===0?-1:1)*.035*swapArc;
      result.rz*=.65;
      result.ry*=.7;
    }
    return result;
  }) as [PacketPose,PacketPose];
  return {packets,orbit:mix(a.orbit,b.orbit),phone:mix(a.phone,b.phone)};
}
function mixMobile(a:number,b:number,t:number){return a+(b-a)*t}
