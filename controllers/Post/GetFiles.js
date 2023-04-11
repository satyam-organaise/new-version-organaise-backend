import userModel from "../../model/fileModel.js";



const getFiles = async(req,res) => {
   const userid = req.body.userId;
   const selectModel = await userModel.find({userId:{$eq:userid}});
   res.status(200).json({
      data:selectModel,
      status:true
   })
}

export default getFiles;