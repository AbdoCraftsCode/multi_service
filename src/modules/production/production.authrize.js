import { roletypes } from "../../DB/models/User.model.js";

export const endpoint = {

    create: [roletypes.Owner , roletypes.Admin],
    update: [roletypes.Owner, roletypes.Admin],
    delete: [roletypes.Owner, roletypes.Admin],
}