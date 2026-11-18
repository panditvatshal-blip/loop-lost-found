const multer=require('multer'),path=require('path'),fs=require('fs'),cloudinary=require('cloudinary').v2;
const cloudReady=process.env.CLOUDINARY_CLOUD_NAME&&process.env.CLOUDINARY_API_KEY&&process.env.CLOUDINARY_API_SECRET;
let storage;
if(cloudReady){cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
 const {CloudinaryStorage}=require('multer-storage-cloudinary');
 storage=new CloudinaryStorage({cloudinary,params:{folder:'loop-lost-found',allowed_formats:['jpg','jpeg','png','webp']}});
}else{const dir=path.join(process.cwd(),'uploads');fs.mkdirSync(dir,{recursive:true});
 storage=multer.diskStorage({destination:dir,filename:(_r,f,cb)=>cb(null,Date.now()+'-'+Math.round(Math.random()*1e9)+path.extname(f.originalname).toLowerCase())});}
const upload=multer({storage,limits:{fileSize:5*1024*1024},fileFilter:(_r,f,cb)=>['image/jpeg','image/png','image/webp'].includes(f.mimetype)?cb(null,true):cb(new Error('Only JPG, PNG and WEBP images up to 5 MB are allowed.'))});
const imageUrl=f=>!f?null:(f.path||'/uploads/'+f.filename);
module.exports={upload,imageUrl};
