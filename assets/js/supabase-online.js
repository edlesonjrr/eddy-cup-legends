import { createClient } from '@supabase/supabase-js';

const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const configured=Boolean(url&&key);
const supabase=configured?createClient(url,key,{auth:{persistSession:false}}):null;
const endpoint=configured?`${url}/functions/v1/online-rooms`:'';
let activeToken='';
let activeChannel=null;
let activeRoomCode='';

const fail=(message,status=0)=>{const error=new Error(message);error.status=status;throw error};
const announce=code=>{if(!supabase)return;const channel=supabase.channel(`eddy-room-${code}`);channel.subscribe(status=>{if(status==='SUBSCRIBED'){channel.send({type:'broadcast',event:'changed',payload:{at:Date.now()}}).finally(()=>setTimeout(()=>supabase.removeChannel(channel),250))}})};

async function request(path,options={}){
  if(!configured)fail('Modo Online ainda não foi configurado.');
  const response=await fetch(`${endpoint}${path}`,{
    ...options,
    headers:{apikey:key,'content-type':'application/json',...(activeToken?{'x-room-token':activeToken}:{}),...options.headers}
  });
  const data=await response.json().catch(()=>({error:'Resposta inválida do servidor.'}));
  if(!response.ok)fail(data.error||'Falha na sala Online.',response.status);
  return data;
}

export async function onlineRoomRequest(path,options={}){
  const data=await request(path,options);
  if(data.token){
    activeToken=data.token;
    activeRoomCode=data.code;
    try{sessionStorage.setItem(`eddy-room-${data.code}`,data.token)}catch{}
    if(data.role==='guest')announce(data.code);
  }
  if((options.method||'GET').toUpperCase()!=='GET'&&!data.token&&activeChannel){
    activeChannel.send({type:'broadcast',event:'changed',payload:{at:Date.now()}}).catch(()=>{});
  }
  return data;
}

export function watchOnlineRoom(code,onChange){
  if(!supabase)return()=>{};
  activeRoomCode=code;
  if(!activeToken){try{activeToken=sessionStorage.getItem(`eddy-room-${code}`)||''}catch{}}
  const channel=supabase.channel(`eddy-room-${code}`)
    .on('broadcast',{event:'changed'},onChange)
    .subscribe();
  activeChannel=channel;
  return()=>{if(activeChannel===channel)activeChannel=null;supabase.removeChannel(channel)};
}

export function leaveOnlineRoom(code){
  if(!configured||!activeToken||!code)return;
  activeChannel?.send({type:'broadcast',event:'changed',payload:{at:Date.now(),leaving:true}}).catch(()=>{});
  request(`/api/rooms/${code}/leave`,{method:'PUT',body:'{}',keepalive:true}).catch(()=>{});
}

addEventListener('beforeunload',()=>{
  if(activeRoomCode)leaveOnlineRoom(activeRoomCode);
});
