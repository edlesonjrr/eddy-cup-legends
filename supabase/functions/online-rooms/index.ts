import { createClient } from "npm:@supabase/supabase-js@2.90.1";

const allowedOrigins=new Set(["https://eddy-cup-legends.vercel.app"]);
const baseCors={"access-control-allow-headers":"apikey, content-type, x-room-token","access-control-allow-methods":"GET, POST, PUT, OPTIONS","vary":"origin","content-type":"application/json"};
const hash=async(value:string)=>{const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,"0")).join("")};
const token=()=>crypto.randomUUID().replaceAll("-","")+crypto.randomUUID().replaceAll("-","");
const roomCode=()=>{const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",bytes=crypto.getRandomValues(new Uint8Array(6));return Array.from(bytes,value=>alphabet[value%alphabet.length]).join("")};
const cleanState=(body:any)=>({side:body?.side==="away"?"away":"home",formation:typeof body?.formation==="string"?body.formation:null,lineupIds:Array.isArray(body?.lineupIds)?body.lineupIds.slice(0,11).map(String):[],progress:Math.min(11,Math.max(0,Number(body?.progress)||0)),coach:String(body?.coach||"").slice(0,60),captainId:String(body?.captainId||"").slice(0,80),strategy:["attack","balanced","defend","counter"].includes(body?.strategy)?body.strategy:"balanced",finished:Boolean(body?.finished)});
const cleanJson=(value:unknown,depth=0):unknown=>{if(depth>6)return null;if(typeof value==="string")return value.slice(0,500).replace(/[<>&"']/g,"");if(typeof value==="number")return Number.isFinite(value)?value:0;if(typeof value==="boolean"||value===null)return value;if(Array.isArray(value))return value.slice(0,100).map(item=>cleanJson(item,depth+1));if(typeof value==="object"){const output:Record<string,unknown>={};for(const [key,item] of Object.entries(value as Record<string,unknown>).slice(0,60)){if(key!=="__proto__"&&key!=="constructor"&&key!=="prototype")output[key]=cleanJson(item,depth+1)}return output}return null};

Deno.serve(async req=>{
  const origin=req.headers.get("origin");
  const cors={...baseCors,"access-control-allow-origin":origin||"https://eddy-cup-legends.vercel.app"};
  const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:cors});
  const localOrigin=Boolean(origin&&/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin));
  if(origin&&!allowedOrigins.has(origin)&&!localOrigin)return json({error:"Origem não autorizada."},403);
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  try{
    if(Number(req.headers.get("content-length")||0)>65536)return json({error:"Requisição muito grande."},413);
    const publishableRaw=Deno.env.get("SUPABASE_PUBLISHABLE_KEYS"),publishable=publishableRaw?Object.values(JSON.parse(publishableRaw)):[] as string[],legacy=Deno.env.get("SUPABASE_ANON_KEY");
    if(legacy)publishable.push(legacy);
    if(publishable.length&&!publishable.includes(req.headers.get("apikey")||""))return json({error:"Aplicativo não autorizado."},401);
    const db=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}}),url=new URL(req.url),marker="/online-rooms",relative=url.pathname.slice(url.pathname.indexOf(marker)+marker.length),parts=relative.split("/").filter(Boolean),now=new Date();

    if(req.method==="POST"&&relative==="/api/rooms"){
      await db.from("rooms").delete().lt("expires_at",now.toISOString());
      const {count,error:countError}=await db.from("rooms").select("code",{count:"exact",head:true});
      if(countError)throw countError;
      if((count||0)>=25)return json({error:"Limite temporário de salas atingido. Tente novamente mais tarde."},429);
      for(let attempt=0;attempt<6;attempt++){
        const code=roomCode(),hostToken=token(),hostHash=await hash(hostToken),expiresAt=new Date(now.getTime()+30*60*1000).toISOString(),{error}=await db.from("rooms").insert({code,host_token_hash:hostHash,expires_at:expiresAt});
        if(error?.code==="23505")continue;
        if(error)throw error;
        return json({code,token:hostToken,role:"host"});
      }
      return json({error:"Não foi possível criar a sala."},500);
    }

    if(parts[0]!=="api"||parts[1]!=="rooms"||!parts[2])return json({error:"Rota inválida."},404);
    const code=parts[2].toUpperCase(),{data:room,error:roomError}=await db.from("rooms").select("*").eq("code",code).maybeSingle();
    if(roomError)throw roomError;
    if(!room||new Date(room.expires_at)<=now)return json({error:"Sala não encontrada ou expirada."},404);

    if(req.method==="POST"&&parts[3]==="join"){
      if(room.guest_token_hash)return json({error:"A sala já possui dois jogadores."},409);
      const guestToken=token(),guestHash=await hash(guestToken),deadline=new Date(now.getTime()+180000).toISOString(),{data,error}=await db.from("rooms").update({guest_token_hash:guestHash,status:"drafting",deadline,updated_at:now.toISOString()}).eq("code",code).is("guest_token_hash",null).select("code").maybeSingle();
      if(error)throw error;
      if(!data)return json({error:"Outro jogador entrou primeiro."},409);
      return json({code,token:guestToken,role:"guest",deadline:new Date(deadline).getTime()});
    }

    const supplied=req.headers.get("x-room-token")||"";
    if(!supplied)return json({error:"Token da sala ausente."},401);
    const suppliedHash=await hash(supplied),role=suppliedHash===room.host_token_hash?"host":suppliedHash===room.guest_token_hash?"guest":"";
    if(!role)return json({error:"Acesso negado à sala."},403);

    if(req.method==="PUT"&&parts[3]==="state"){
      const body=cleanState(await req.json()),field=role==="host"?"host_state":"guest_state",leftField=role==="host"?"host_left":"guest_left",{error}=await db.from("rooms").update({[field]:body,[leftField]:false,updated_at:now.toISOString()}).eq("code",code);
      if(error)throw error;return json({ok:true});
    }
    if(req.method==="PUT"&&parts[3]==="match"){
      if(role!=="host")return json({error:"Somente o criador controla a partida."},403);
      const body=cleanJson(await req.json()) as any,{error}=await db.from("rooms").update({match_state:body,status:body?.finished?"finished":"playing",updated_at:now.toISOString()}).eq("code",code);
      if(error)throw error;return json({ok:true});
    }
    if(req.method==="PUT"&&parts[3]==="decision"){
      const body=cleanJson(await req.json()),field=role==="host"?"host_decision":"guest_decision",{error}=await db.from("rooms").update({[field]:body,updated_at:now.toISOString()}).eq("code",code);
      if(error)throw error;return json({ok:true});
    }
    if(req.method==="PUT"&&parts[3]==="leave"){
      if(role==="host"){
        const {error}=await db.from("rooms").delete().eq("code",code);
        if(error)throw error;
        return json({ok:true,deleted:true,reason:"host_left"});
      }
      const field=role==="host"?"host_left":"guest_left",{data,error}=await db.from("rooms").update({[field]:true,updated_at:now.toISOString()}).eq("code",code).select("status,host_left,guest_left").single();
      if(error)throw error;
      if(data.status==="finished"&&data.host_left&&data.guest_left){
        const {error:deleteError}=await db.from("rooms").delete().eq("code",code);
        if(deleteError)throw deleteError;
        return json({ok:true,deleted:true});
      }
      return json({ok:true,deleted:false});
    }
    if(req.method==="GET"&&parts.length===3){
      const deadline=room.deadline?new Date(room.deadline).getTime():0,reveal=Boolean(room.host_state?.finished&&room.guest_state?.finished)||Boolean(deadline&&deadline<=Date.now()),publicState=(state:any)=>reveal?state:{formation:state?.formation||null,progress:state?.progress||0,finished:Boolean(state?.finished)};
      return json({code,status:room.status,deadline,connected:Boolean(room.guest_token_hash),you:role,host:role==="host"?room.host_state:publicState(room.host_state),guest:role==="guest"?room.guest_state:publicState(room.guest_state),match:room.match_state,hostDecision:room.host_decision,guestDecision:room.guest_decision,serverTime:Date.now()});
    }
    return json({error:"Operação inválida."},404);
  }catch(error){console.error(error);return json({error:error instanceof Error?error.message:"Falha interna da sala."},500)}
});
