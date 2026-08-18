export const getPosts =  (req,res,next)=>{
    res.status(200)
        .json({posts:[{title:"first post",
                       content:"this is some post :D"}]});
};
export const postPost = (req,res,next)=>{
    const title = req.body.title;
    const content = req.body.content;
    //create a post in db
    res.status(201).json({
        message: "Post created successfully",
        post:{
            id:new Date().toISOString(),
            title:title,
            content:content
        }
     });
}