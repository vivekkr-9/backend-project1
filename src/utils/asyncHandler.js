const asyncHandler = (requestHandler)=>{                      // this function is a new way to code 
    (req,res,next)=>{                                          // that is used in the place of the method
        Promise.resolve(requestHandler(req,res,next)).          //  written below of examples
        catch((err)=>next(err))
    }
}

export {asyncHandler}

//Examples to show and understand
// const asyncHandler = () => {}
// const asyncHandler = (func) => ()=> {}
// const asyncHandler = (func) => async () => {}

// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }