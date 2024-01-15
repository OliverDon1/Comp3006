const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const { Accounts } = require("./accountSchema");
const { Books } = require("./bookSchema");
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const staticDir = path.join(__dirname);
app.use(express.static(staticDir));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/getAccounts', async (req, res) => {
    try {
        await mongoose.connect("mongodb+srv://its0ll13:Password1234@libarydb.ndilym7.mongodb.net/");
        const accountsData = await Accounts.find({});
        res.json(accountsData);
    } catch (error) {
        console.error('Error retrieving accounts data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        mongoose.disconnect();
    }
});
app.get('/getBooks', async(req,res) =>{
    try{
        await mongoose.connect("mongodb+srv://its0ll13:Password1234@libarydb.ndilym7.mongodb.net/");
        const bookData = await Books.find({});
        res.json(bookData);
    }
    catch(error){
        console.error('Error has occured:',error)
        res.status(500).json({error : 'Internal Server Error'});
    }
    finally{
        mongoose.disconnect();
    }
});
app.use(express.json());
app.post("/reserveBook", async (req, res) => {
    try {
        await mongoose.connect("mongodb+srv://its0ll13:Password1234@libarydb.ndilym7.mongodb.net/");
        const book = await Books.findOne({ name: req.body.name });
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        let newbook = req.body;
        book.available = newbook.available;
        await book.save();
        res.status(200).json({ message: "Book reserved successfully" });
    } catch (error) {
        console.error("Error reserving book:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        mongoose.disconnect();
    }
});
app.post("/accountChange", async (req, res) => {
    try {
        await mongoose.connect("mongodb+srv://its0ll13:Password1234@libarydb.ndilym7.mongodb.net/");
        const { username, password, CRB } = req.body;
        const existingAccount = await Accounts.findOne({ username });
        if (existingAccount) {
            existingAccount.password = password;
            existingAccount.CRB = CRB;
            const updatedAccount = await existingAccount.save();

            res.status(200).json({ message: "Account updated successfully", updatedAccount });
        } else {
            res.status(404).json({ error: "Account not found" });
        }
    } catch (error) {
        console.error("Error updating account:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    finally{
        mongoose.disconnect();
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('accountNew', async (data) => {
      try {
        await mongoose.connect("mongodb+srv://its0ll13:Password1234@libarydb.ndilym7.mongodb.net/");
        const { username, password } = data;
        const newAccount = new Accounts({
          username: username,
          password: password,
          CRB: []
        });
        await newAccount.save();
        io.emit('accountCreated', { message: 'Account created successfully' });
      } catch (error) {
        console.error("Error creating account:", error);
        // Send the error message back to the client if needed
        io.emit('accountCreationError', { error: 'Internal Server Error' });
      } finally {
        mongoose.disconnect();
      }
    });
  
    // ... (other socket event handlers)
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
