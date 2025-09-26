

export const successresponse = (res , message ="done", status=200 , data={}) => {
    

return res.status(status).json({message , data:{...data}})
}