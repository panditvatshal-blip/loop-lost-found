const nodemailer=require('nodemailer');
const transport=process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS?nodemailer.createTransport({
 host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==='true',
 auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}):null;
async function sendMail(to,subject,text){if(!transport||!to)return false;try{await transport.sendMail({from:process.env.MAIL_FROM||process.env.SMTP_USER,to,subject,text});return true;}catch(e){console.error('Email failed:',e.message);return false;}}
module.exports={sendMail};
