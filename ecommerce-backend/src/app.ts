import express from 'express';

const port = 4000;
const app = express();

app.use("/api/v1/user");

app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`);
})