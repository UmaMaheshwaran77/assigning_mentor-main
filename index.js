
const express= require("express");

const cors = require("cors");
const bodyparser = require("body-parser");
const {MongoClient, ObjectId} = require("mongodb");
const dotenv = require("dotenv").config();
// console.log(process.env.DB)

const URL=process.env.DB;


const app = express();

app.use(express.json());



app.use(cors({
    origin:"https://main--dancing-tanuki-aba324.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}))


app.get("/mentor",async(req,res)=>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db("mentor_student");
        const mentor = await db.collection("mentor").find().toArray();
        await connection.close();
        res.json(mentor);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
})


app.post("/mentor",async(req,res)=>{
try{
    const connection = await MongoClient.connect(URL);
    const db = connection.db("mentor_student");
    const user = await db.collection("mentor").insertOne(req.body);
    await connection.close();
    res.json({message:"mentor created successfully"});
}catch(error){
    console.log(error);
    res.status(500).json({message:"Something went wrong"});
}


})



app.post("/student",async(req,res)=>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db("mentor_student");
        const user = await db.collection("student").insertOne(req.body);
        await connection.close();
        res.json({message:"student created successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
    
    
    })



    app.post("/assigning",async(req,res)=>{
        try{
            const connection = await MongoClient.connect(URL);
            const db = connection.db("mentor_student");
            const findStudentName = await db.collection("student").findOne({studentname:req.body.studentname});
            const findMentorName = await db.collection("mentor").findOne({mentorname:req.body.mentorname});
            if(findStudentName && findMentorName){
                const user = await db.collection("assigning").insertOne(req.body);
                await connection.close();
                res.json({message:"mentor created successfully"});
            }else{
                res.status(404).json({message:"Not Found"});
            }
           
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Something went wrong"});
        }
        
        
        })
       
        
  
        // app.put("/assigning/:id", async (req, res) => {
        //     try {
        //         const connection = await MongoClient.connect(URL);
        //         const db = connection.db("mentor_student");
                
        //         // Convert the id parameter to ObjectId
        //         const objectId = new ObjectId(req.params.id);
        
        //         // Exclude the _id field from the update
        //         delete req.body._id;
        
        //         // Use $set to update other fields
        //         const mentor = await db.collection("assigning").updateOne(
        //             { _id: objectId },
        //             { $set: req.body }
        //         );
        
        //         await connection.close();
        //         res.json({ message: "Updated" });
        //     } catch (error) {
        //         console.log(error);
        //         res.status(500).json({ message: "Something went wrong" });
        //     }
        // });
        

        app.get("/assigning",async(req,res)=>{
            try{
                const connection = await MongoClient.connect(URL);
                const db = connection.db("mentor_student");
                const mentor = await db.collection("assigning").find().toArray();
                await connection.close();
                res.json(mentor);
            }catch(error){
                console.log(error);
                res.status(500).json({message:" Something went wrong"});
            }
        })
        
        app.get("/assigning/:id",async(req,res)=>{
            try{
                const connection = await MongoClient.connect(URL);
                const db = connection.db("mentor_student");
                const data = await db.collection("assigning").findOne({_id:new ObjectId(req.params.id)});
                await connection.close();
                res.json(data);
            }catch(error){
                console.log(error);
                res.status(500).json({message:"Something went wrong"});
            }
        })

        app.get("/assigning/mentorname/:mentorname",async(req,res)=>{
            try{
                const connection = await MongoClient.connect(URL);
                const db = connection.db("mentor_student");
                const data = await db.collection("assigning").find({mentorname:req.params.mentorname}).toArray();
                await connection.close();
                res.json(data);
            }catch(error){
                console.log(error);
                res.status(500).json({message:"Something went wrong"});
            }
        })

        app.post("/change_mentor",async(req,res)=>{
            try{
                const connection = await MongoClient.connect(URL);
                const db = connection.db("mentor_student");
                // const data = await db.collection("assigning").findOne({_id:new ObjectId(req.params.id)});
                const user = await db.collection("change_mentor").insertOne(req.body);
                await connection.close();
                res.json({message:"Mentor Changed successfully"});
            }catch(error){
                console.log(error);
                res.status(500).json({message:"Something went wrong"});
            }
            
            
            })


            app.get("/change_mentor",async(req,res)=>{
                try{
                    const connection = await MongoClient.connect(URL);
                    const db = connection.db("mentor_student");
                    const mentor = await db.collection("change_mentor").find().toArray();
                    await connection.close();
                    res.json(mentor);
                }catch(error){
                    console.log(error);
                    res.status(500).json({message:" Something went wrong"});
                }
            })
            

            // app.get("/previous_mentor",async(req,res)=>{
            //     try{
            //         const connection = await MongoClient.connect(URL);
            //         const db = connection.db("mentor_student");
                  
            //         const mentor = await db.collection("change_mentor").find().toArray();
                    
            //         await connection.close();
            //         res.json(mentor);
            //     }catch(error){
            //         console.log(error);
            //         res.status(500).json({message:" Something went wrong"});
            //     }
            // })

            app.get("/previous_mentor/:studentname", async (req, res) => {
                try {
                    const connection = await MongoClient.connect(URL);
                    const db = connection.db("mentor_student");
            
                    // Find the student in the assigning collection to get the previous mentor
                    const assigningData = await db.collection("assigning").findOne({ studentname: req.params.studentname });
            
                    if (assigningData) {
                        // If the student is found in the assigning collection, find the previous mentor in the change_mentor collection
                        const previousMentorData = await db.collection("change_mentor").findOne({ studentname: req.params.studentname });
            
                        if (previousMentorData) {
                            // If the previous mentor is found, return the data
                            await connection.close();
                            res.json(previousMentorData);
                        } else {
                            // If no previous mentor data is found, return a message or appropriate response
                            await connection.close();
                            res.json({ message: "No previous mentor found for the student" });
                        }
                    } else {
                        // If the student is not found in the assigning collection, return a message or appropriate response
                        await connection.close();
                        res.json({ message: "Student not found in the assigning collection" });
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ message: "Something went wrong" });
                }
            });
            

app.listen(3005);

