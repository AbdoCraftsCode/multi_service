// import nodemailer from "nodemailer";

// export const sendemail = async ({
//     to = [],
//     subject = "",
//     text = "",
//     html = "",
//     attachments = []
// } = {}) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: "smtp-relay.brevo.com",
//             port: 587, // أو 465 لو SSL
//             secure: false, // true لو 465
//             auth: {
//                 user: process.env.BREVO_LOGIN,  // 👈 ده الـ Login اللي شكله 88d9cf001@smtp-brevo.com
//                 pass: process.env.BREVO_SMTP_KEY, // 👈 ده الـ SMTP key
//             },
//             tls: { rejectUnauthorized: false }
//         });

//         const info = await transporter.sendMail({
//             from: `"yallabina 👻" <${process.env.SENDER_EMAIL}>`, // لازم يبقى Sender Verified
//             to,
//             subject,
//             text,
//             html,
//             attachments,
//         });

//         console.log("✅ Message sent:", info.messageId);
//         console.log("📬 Full Response:", info);
//         return info;
//     } catch (error) {
//         console.error("❌ Email send error:", error);
//         throw error; // عشان signup يلقط الغلط
//     }
// };  
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
import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendemail = async ({
    to = [],
    subject = "",
    text = "",
    html = "",
} = {}) => {
    try {
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY; // 👈 مفتاح API من Brevo

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        // تأكد أن to Array
        const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({ email }));

        let sendSmtpEmail = {
            sender: { email: process.env.SENDER_EMAIL, name: "Fedk 👻" },
            to: recipients,
            subject: subject || "No Subject",
            textContent: text || " ",
            htmlContent: html || `<p>${text || "No Content"}</p>`,
        };

        let data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Email sent via API:", data);
        return data;
    } catch (error) {
        console.error("❌ Email send error:", error.response?.text || error.message || error);
        throw error;
    }
};

// await sendemail({
//     to: "yallabinaok@gmail.com",
//     subject: "🚀 تجربة Brevo",
//     text: "هلا، ده مجرد Test",
// });

