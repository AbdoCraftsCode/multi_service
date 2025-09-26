import  ChatModel  from "../../../DB/models/chaatmodel.js";
import { asyncHandelr } from "../../../utlis/response/error.response.js";
import { successresponse } from "../../../utlis/response/success.response.js";
import * as dbservice from "../../../DB/dbservice.js"


export const findonechat = asyncHandelr(async (req, res, next) => {

    const { destId } = req.params;
    const chat = await dbservice.findOneAndUpdate({
        model: ChatModel,

        filter: {

            $or: [
                {
                    mainUser: req.user._id,
                    subpartisipant: destId,


                },
                {
                    mainUser: destId,
                    subpartisipant: req.user._id,

                }


            ]
        },
        populate: [
            {
                path: "mainUser"
            },
            {
                path: "subpartisipant"
            },

            {
                path: "messages.senderId"
            }

        ]

    })

    successresponse(res, { chat })


})