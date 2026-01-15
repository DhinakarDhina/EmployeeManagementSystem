const express = require("express");
const {open}= require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "employeeDetails.db");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());


//Initializing the DB and server
let db = null;
//Function to initialize DB and server
const initializeDBAndServer = async() =>{
    try{
   db = await open({
        filename :dbPath,
        driver : sqlite3.Database
    });

    //Starting the server
    app.listen(3000,()=>
    {
        console.log("Server is running at http://localhost:3000/");
    });
}
//Error handling
catch(e){
    console.log(`DB Errorr: ${e.message}`);
    process.exit(1);
}
};
initializeDBAndServer();

//GET employees detail API
app.get("/candidates/", async(request, response)=>{
    const getCandidatesQuery = `
    SELECT * FROM candidates ORDER BY id; `;
    const candidateArray = await db.all(getCandidatesQuery);
    response.send(candidateArray);
});

//GET employeedetail API by employee_id
app.get("/candidates/:id/", async (request, response)=>{
    const {id} = request.params;
    const getCandidatesQuery=`
    SELECT * FROM candidates WHERE id =${id};`;
    const candidate = await db.get(getCandidatesQuery);
    response.send(candidate);
}); 

//Add employeeDetails API
app.post("/candidates/", async(request, response)=>{
    const candidateDetails = request.body;
    const {first_name, last_name, email, phone_number, position_applied_for, status, application_date, updated_at}= candidateDetails;
    const addCandidateQuery = `
    INSERT INTO candidates (first_name, last_name, email, phone_number, position_applied_for, status, application_date, updated_at)
    VALUES ('${first_name}', '${last_name}', '${email}', '${phone_number}', '${position_applied_for}', '${status}', '${application_date}', '${updated_at}');`;
    const result= await db.run(addCandidateQuery);
    const newCandidateId = result. lastID;
    response.send({candidateId:newCandidateId })
    response.send("Candidate added successfully");
});

//Update employeeDetails API
app.put("/candidates/:id/",async(request, response)=>{
    const {id}= request.params;
    const candidateDetails= request.body;
    const {first_name, last_name, email, phone_number, position_applied_for, status, application_date, updated_at}= candidateDetails;
    const updateCandidateDetails = `
    UPDATE candidates
    SET
    first_name = '${first_name}',
    last_name= '${last_name}',
    email = '${email}',
    phone_number = '${phone_number}',
    position_applied_for = '${position_applied_for}',
    status = '${status}',
    application_date = '${application_date}',
    updated_at ='${updated_at}'
     WHERE id = ${id};`;

     const updateDetails =await db.run(updateCandidateDetails);
     response.send("Candidate details updated successfully");
});

//Delete employeeDetails API
app.delete("/candidates/:id/", async(request, response)=>{
    const {id}= request.params;
    const deleteCandidateQuery =`
    DELETE FROM candidates WHERE id= ${id};`;
    const deletecandidate= await db.run(deleteCandidateQuery);
    response.send("Candidate details deleted successfully");
});

//Additional Features
//GET candidate status by first_name API
app.get("/candidates/status/:status", async (request, response) => {
  const { status } = request.params;
  const getCandidatesByStatusQuery = `
    SELECT first_name FROM candidates WHERE status = '${status}';
  `;
  const hiredCandidates = await db.all(getCandidatesByStatusQuery);
  response.send(hiredCandidates);
});

