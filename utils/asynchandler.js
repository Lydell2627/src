// const asynchandler=(requestHandler)=>async(req,res,next)=>{
//     try {
//         await
        
//     } catch (error) {
//         res.status(err.code||500).json({
//             sucess:false,
//             message: err.message || "Internal Server Error"
//         })
//     }
// }

const asynchandler=(requestHandler)=>async(req,res,next)=>{{
    Promise.resolve().catch((err)=>next(err))
}
}


export {asynchandler}