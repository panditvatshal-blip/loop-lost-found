const jwt=require('jsonwebtoken'),{db}=require('../config/db');
async function auth(req,res,next){try{
 const h=req.headers.authorization||'',token=h.startsWith('Bearer ')?h.slice(7):null;
 if(!token)return res.status(401).json({message:'Please log in.'});
 const p=jwt.verify(token,process.env.JWT_SECRET);
 const user=await db().collection('users').findOne({user_id:Number(p.id)},{projection:{user_id:1,name:1,email:1,role:1,status:1}});
 if(!user||user.status!=='active')return res.status(401).json({message:'Account unavailable.'});
 req.user=user;next();
 }catch{return res.status(401).json({message:'Session expired. Please log in again.'});}}
function admin(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Administrator access required.'});next();}
module.exports={auth,admin};
