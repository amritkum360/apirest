const express = require('express')
const mongoose = require('mongoose')
const app = express();
const connectDb = require("./db")
const PORT = process.env.PORT || 8080
app.use(express.json());



// Define a schema for your collection
const yourCollectionSchema = new mongoose.Schema({
  weight: Number,
  rate: Number,
  date: Date,
  paid: Boolean,
  makedelete: Boolean,
});


const YourCollectionModel = mongoose.model('YourCollection', yourCollectionSchema);

app.get("/",(req, res)=>{
    res.send("the server ready for my book")
})

// API endpoint to add a member
app.post('/addmember', async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new member with the provided name
    const newMember = new YourCollectionModel({ name });
    await newMember.save();

    res.status(201).json({ message: 'Member added successfully', newMember });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Failed to add member' });
  }
});


app.get("/data",async(req, res)=>{
    try{
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Extract collection IDs and names from the fetched collections
    const collectionDetails = collections.map(collection => ({
        id: collection.id, // Use the collection name as the ID (you may adjust this based on your schema)
        name: collection.name
      }));
  
      // Send the list of collection details (ID and name) as a JSON response
      res.json({ collections: collectionDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
})


app.get("/detail/:collectionName", async (req, res) => {
    try {
      const collectionName = req.params.collectionName;
  
      // Fetch the inner data of the specified collection
      const collectionData = await mongoose.connection.db.collection(collectionName).find().toArray();
      const { weight, rate, date, paid, makedelete } = req.body;
      // Send the inner data of the collection as a JSON response
      res.json({ collectionData });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put('/api/updatepaid/:collectionName/:itemId', async (req, res) => {
    try {
        const collectionName = req.params.collectionName;
        const itemId = req.params.itemId;
        const { paid } = req.body;

        const CollectionModel = mongoose.model(collectionName, yourCollectionSchema);
        const updatedDetail = await CollectionModel.findByIdAndUpdate(
            itemId,
            { paid }, // Update only the 'paid' field
            { new: true }
        );

        if (!updatedDetail) {
            return res.status(404).json({ message: 'Detail not found' });
        }

        res.json({ message: 'Payment status updated successfully', updatedDetail });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Error updating payment status' });
    }
});




app.put('/api/updatepaidfalse/:collectionName/:itemId', async (req, res) => {
  try {
      const collectionName = req.params.collectionName;
      const itemId = req.params.itemId;
      const { paid } = req.body;

      const CollectionModel = mongoose.model(collectionName, yourCollectionSchema);
      const updatedDetail = await CollectionModel.findByIdAndUpdate(
          itemId,
          { paid }, // Update only the 'paid' field
          { new: true }
      );

      if (!updatedDetail) {
          return res.status(404).json({ message: 'Detail not found' });
      }

      res.json({ message: 'Payment status updated successfully', updatedDetail });
  } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ message: 'Error updating payment status' });
  }
});

app.put('/api/undelete/:collectionName/:itemId', async (req, res) => {
  try {
      const collectionName = req.params.collectionName;
      const itemId = req.params.itemId;
      const { makedelete } = req.body;

      // Update the 'delete' field to false for the specified item
      const CollectionModel = mongoose.model(collectionName, yourCollectionSchema);
      const updatedItem = await CollectionModel.findByIdAndUpdate(
          itemId,
          { makedelete },
          { new: false }
      );

      if (!updatedItem) {
          return res.status(404).json({ message: 'Item not found' });
      }

      res.json({ message: 'Item undeleted successfully', updatedItem });
  } catch (error) {
      console.error('Error undeleting item:', error);
      res.status(500).json({ message: 'Error undeleting item' });
  }
});


// Assuming express app and MongoDB setup

app.put('/api/update-delete/:itemName/:itemId', async (req, res) => {
  try {
    const { itemName, itemId } = req.params;
    const { makedelete } = req.body; // Renamed to 'isDeleted' to avoid conflicts

    // Find the collection associated with the itemName
    const CollectionModel = mongoose.model(itemName, yourCollectionSchema);

    // Find the item by ID and update its 'delete' field
    const updatedItem = await CollectionModel.findByIdAndUpdate(
      itemId,
      { makedelete },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Delete status updated successfully', updatedItem });
  } catch (error) {
    console.error('Error updating delete status:', error);
    res.status(500).json({ message: 'Error updating delete status' });
  }
});




  // adding detail

  // Assuming you have already set up your Express server
  app.post('/api/addItem/:collectionName', async (req, res) => {
    try {
      const collectionName = req.params.collectionName;
  
      // Extract data from the request body
      const { weight, rate, date, paid, makedelete } = req.body;
  
      // Create a new document using the model associated with the collection
      const CollectionModel = mongoose.model(collectionName, yourCollectionSchema);
      const newItem = new CollectionModel({
        weight,
        rate,
        date,
        paid,
        makedelete,
      });
  
      const savedItem = await newItem.save();
  
      res.json({ message: 'Item added successfully', savedItem });
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ message: 'Error adding item' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });