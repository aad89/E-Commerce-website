const express = require("express");
const Products = require("./products.model");
const Reviews = require("../reviews/reviews.model");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

router.post("/create-product", async(req,res)=>{
    try {
        const newProduct = new Products({
            ...req.body
        })

        const savedProduct = await newProduct.save()
        //calculate reviews
        const reviews = await Reviews.find({productId: savedProduct._id})
        if(reviews.length > 0){
            const totalRating = reviews.reduce((acc, review)=> acc + review.rating, 0)
            const averageRating = totalRating / reviews.length;
            savedProduct.rating = averageRating;
            await savedProduct.save()
        }
        res.status(200).send(savedProduct)
    } catch (error) {
        console.error("Error creating new Products", error)
        res.status(500).send({
            message: "Failed to create new Products",
        })
    }
})

router.get('/', async (req, res) => {
    try {
      const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  
      let filter = {};
  
      // Handle category filter: if it's not 'all' or empty, apply the filter
      if (category && category !== "all" && category !== "") {
        filter.category = category;
      }
  
      // Handle color filter: if it's not 'all' or empty, apply the filter
      if (color && color !== "all" && color !== "") {
        filter.color = color;
      }
  
      // Handle price range filter: only apply if both minPrice and maxPrice are valid
     if (minPrice !== undefined && maxPrice !== undefined && minPrice !== '' && maxPrice !== '') {
  const min = parseFloat(minPrice);
  const max = parseFloat(maxPrice);

  if (!isNaN(min) && !isNaN(max) && min <= max) {
    filter.price = { $gte: min, $lte: max };
  } else {
    console.error(`Invalid price range: min=${minPrice}, max=${maxPrice}`);
  }
}
  
      // Pagination calculations
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalProducts = await Products.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / parseInt(limit));
  
      // Fetch products with the filter, pagination, and sorting
      const products = await Products.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("author", "email")
        .sort({ createdAt: -1 });
  
      // Send the response with products and pagination details
      res.status(200).send({ products, totalPages, totalProducts });
    } catch (error) {
      // Log the error stack for debugging purposes
      console.error("Error Fetching Products:", error.stack);
  
      // Return a response with a more informative error message
      res.status(500).send({
        message: "Failed Fetching Products",
        error: error.message,
      });
    }
  });
  

router.get("/:id", async(req,res)=>{
    try {
        const productId = req.params.id;
        console.log(productId)
        const product = await Products.findById(productId).populate("author", "email username")
        if(!product){
            return res.status(404).send({
                message: "Product Not Found"
            })
        }
        const reviews = await Reviews.find({productId}).populate("userId", "username email")
        res.status(200).send({product, reviews})
    } catch (error) {
        console.error("Error Fetching single product", error)
        res.status(500).send({
            message: "Failed Fetching single product",
        })
    }
})

//update a product

router.patch('/update-product/:id',  verifyToken, verifyAdmin, async(req,res)=>{
    try {
        const productId = req.params.id;
        const updatedProduct = await Products.findByIdAndUpdate(productId, {...req.body}, {new: true})
        if(!updatedProduct){
            return res.status(404).send({message: "Product Not Found"})
        }

        res.status(200).send({message: "Product updated successfull", product: updatedProduct})
    } catch (error) {
        console.error("Error Updating product", error)
        res.status(500).send({
            message: "Failed Updating product",
        })
    }
})

//delete a product

router.delete("/:id", async(req,res)=>{
    try {
        const productId = req.params.id;
        const deletedProduct = await Products.findByIdAndDelete(productId)
        if(!deletedProduct){
            return res.status(404).send({message: "Product Not Found"})
        }
        //delete reviews

        await Reviews.deleteMany({productId: productId})

        res.status(200).send({message: "Products deleted successfully"})
    } catch (error) {
        console.error("Error Deleting product", error)
        res.status(500).send({
            message: "Failed Deleting product",
        })
    }
})

//get related products

router.get("/related/:id", async(req,res)=>{
    try {
        const {id} = req.params;

        if(!id){
            return res.status(404).send({message: "Product Id is required"})
        }
        const product = await Products.findById(id);
        if(!product){
            return res.status(404).send({message: "Product is Not Found"})
        }
        const titleRegex = new RegExp(
            product.name.split(" ").filter((word)=> word.length > 1).join("|"), "i"
        );

        const relatedProducts = await Products.find({
            _id: {$ne: id},
            $or: [
                {name: {$regex: titleRegex}},
                {category: product.category}
            ]
        })

        res.status(200).send(relatedProducts);
    } catch (error) {
        console.error("Error Fetching related product", error)
        res.status(500).send({
            message: "Failed Fetching related product",
        })
    }
})

module.exports = router;
