import { connectDB } from "./DB/connection.js"
import { globalerror } from "./utlis/response/error.response.js"

import authcontroller from "./modules/auth/auth.controller.js"
import usercontroller from "./modules/user/user.controller.js"
// import companycontroller from "./modules/company/company.controller.js"
// import jopcontroller from "./modules/jops/jop.controller.js"
// import admincontroller from "./modules/admin/admin.controller.js"
import chatcontroller from "./modules/chat/chat.controller.js"
// import categorycontroller from "./modules/product/catewgory.controller.js"
import productiontroller from "./modules/production/production.controller.js"
import cors from 'cors';


export const bootstap = (app , express) => {
    app.use(cors());
    app.use(express.json())
    connectDB();
    app.use("/auth", authcontroller)
    // app.use("/category", categorycontroller)
    app.use("/user", usercontroller)
    // app.use("/company", companycontroller)
    // app.use("/jop", jopcontroller)
    // app.use("/admin", admincontroller)
    app.use("/chat", chatcontroller)
    app.use("/product", productiontroller)
    app.use(globalerror)

}



export  default bootstap