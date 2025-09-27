import nodemailer from "nodemailer";

export const sendemail = async ({
    to = [],
    subject = "",
    text = "",
    html = "",
    attachments = []
} = {}) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587, // أو 465 لو SSL
            secure: false, // true لو 465
            auth: {
                user: process.env.BREVO_LOGIN,  // 👈 ده الـ Login اللي شكله 88d9cf001@smtp-brevo.com
                pass: process.env.BREVO_SMTP_KEY, // 👈 ده الـ SMTP key
            },
            tls: { rejectUnauthorized: false }
        });

        const info = await transporter.sendMail({
            from: `"yallabina 👻" <${process.env.SENDER_EMAIL}>`, // لازم يبقى Sender Verified
            to,
            subject,
            text,
            html,
            attachments,
        });

        console.log("✅ Message sent:", info.messageId);
        console.log("📬 Full Response:", info);
        return info;
    } catch (error) {
        console.error("❌ Email send error:", error);
        throw error; // عشان signup يلقط الغلط
    }
};  
// import nodemailer from "nodemailer"




// export const sendemail = async ({
//     to = [],
//     subject = "",
//     text = "",
//     html = "",
//     attachments = [],
// } = {}) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.EMAIL_PASSWORD,
//             },
//             tls: { rejectUnauthorized: false }
//         });

//         const info = await transporter.sendMail({
//             from: `"yallabina 👻" <${process.env.EMAIL}>`,
//             to,
//             subject,
//             text,
//             html,
//             attachments,
//         });

//         console.log("✅ Email sent:", info.messageId);
//         return info;
//     } catch (error) {
//         console.error("❌ Error sending email:", error);
//         throw error;
//     }
// };

