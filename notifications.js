const r=require('express').Router(),{db}=require('../config/db'),{auth}=require('../middleware/auth');r.use(auth);
r.get('/',async(q,s,n)=>{try{const x=await db().collection('notifications').find({user_id:q.user.user_id}).sort({created_at:-1}).limit(50).toArray();s.json(x);}catch(e){n(e);}});
r.put('/read-all',async(q,s,n)=>{try{await db().collection('notifications').updateMany({user_id:q.user.user_id},{$set:{is_read:true}});s.json({message:'Read.'});}catch(e){n(e);}});
r.put('/:id/read',async(q,s,n)=>{try{await db().collection('notifications').updateOne({notif_id:Number(q.params.id),user_id:q.user.user_id},{$set:{is_read:true}});s.json({message:'Read.'});}catch(e){n(e);}});
module.exports=r;
