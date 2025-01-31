const {readDatabase , writeDatabase} = require('./ModulesToImport.js')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const LoginFile = './Functions/Database/LoginDetails.json';
const ProductFile = './Functions/Database/ProductDetails.json'
const QueryFile = './Functions/Database/Query.json'
const ChatFile = './Functions/Database/Chat.json'

const secret_key = "qwertyuiopkjhgf987654g[;,mhgdxcvbnl;jhtrdcvbnkl;lkjhg"

const mongoose = require('mongoose');   
const User = require('./models/User');  // Import User model
const Product = require('./models/Products');  // Import Product model
const ChatGroup = require('./models/ChatGroups.js')

// const SignUp = function (req,res){
    // const login_database = readDatabase(LoginFile);
    // const product_database = readDatabase(ProductFile);
    // let id ;
    // if(login_database.length==0){
    //     id = 1 ;
    // }else{
    //     id = login_database[login_database.length-1].UserId + 1 ;
    //     for(let i = 0  ; i < login_database.length ; i++){
    //         if(login_database[i].Email==req.body.Email){
    //             return res.status(400).json({
    //                 msg : "Email already Registered"
    //             })
    //         }
    //     }
    // }
    // const Crypted_Password = bcrypt.hashSync(req.body.Password,8);
    // const newSignUp = {
    //     UserId : id,
    //     Email : req.body.Email,
    //     Name : req.body.Name,
    //     Password : Crypted_Password,
    //     Contact : req.body.Contact,
    //     InProgressBuying :[],
    //     Bought : []
    // }
    // login_database.push(newSignUp);
    // writeDatabase(LoginFile,login_database);

    // const products = {
    //     UserId : id,
    //     Products : []
    // }
    // product_database.push(products);
    // writeDatabase(ProductFile,product_database);
    // const token = jwt.sign({UserId:id},secret_key)
    // return res.status(202).json({
    //     msg : "Login Successfull",
    //     token : token
    // })
// }

const SignUp = async function(req,res){
    try {
        const { Email, Name, Password, Contact } = req.body;
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({
                msg: "Email already Registered"
            });
        }
        const Crypted_Password = bcrypt.hashSync(Password, 8);
        const newUser = new User({  
        Email,
        Name,
        Password: Crypted_Password,
        Contact
        });
        await newUser.save();
        const newProduct = new Product({
        UserId: newUser._id,
        Products: []
        });
        await newProduct.save();
        const token = jwt.sign({ UserId: newUser._id, Name: newUser.Name }, secret_key);
        return res.status(202).json({
        msg: "Signup Successful",
        token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
        msg: "Server Error",
        error
        });
    }
}

// const Login = function(req,res){
//     const login_database = readDatabase(LoginFile);
//     for(let i = 0 ; i < login_database.length ; i++ ){
//         if(login_database[i].Email == req.body.Email ){
//             if(bcrypt.compareSync(req.body.Password,login_database[i].Password)){
//                 const token = jwt.sign({UserId:login_database[i].UserId},secret_key,{ expiresIn: '1h' })
//                 return res.status(202).json({
//                     msg : "Login Successfull",
//                     token : token
//                 })
//             }else{
//                 res.status(400).json({
//                     msg : "Incorrect Password..."
//                 })
//             }
//         }
//     }
//     res.status(401).json({
//         msg : "Recheck Your Email ID "
//     })
// }

const Login = async function (req,res) {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });
        if (!user) {
          return res.status(401).json({
            msg: "Recheck Your Email ID"
          });
        }
        const passwordMatch = bcrypt.compareSync(Password, user.Password);
        if (!passwordMatch) {
          return res.status(400).json({
            msg: "Incorrect Password"
          });
        }
        const token = jwt.sign({ UserId: user._id, Name: user.Name }, secret_key);
        return res.status(202).json({
          msg: "Login Successful",
          token
        });
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          msg: "Server Error",
          error
        });
    }
}

// const UpdateProfile = function(req,res){
//     const login_database = readDatabase(LoginFile);
//     for(let i = 0; i< login_database.length;i++){
//         if(req.user.UserId==login_database[i].UserId){
//             login_database[i].Name = req.body.Name;
//             login_database[i].Contact = req.body.Contact;
//             login_database[i].Email = req.body.Email;
//             writeDatabase(LoginFile,login_database);
//             res.status(202).json({
//                 msg : "Updated Data "
//             });
//         }
//     }
//     res.status(401).json({
//         msg : "Email Lost",
//     })
// }

const UpdateProfile = async function(req,res){
    try {
        const { Name, Email, Contact } = req.body;
        const userId = req.user.UserId;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(401).json({
            msg: "Email Lost"
          });
        }
        user.Name = Name;
        user.Email = Email;
        user.Contact = Contact;
        await user.save();
        return res.status(202).json({
          msg: "Updated Data"
        });
        
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          msg: "Server Error",
          error
        });
    }
}

// const ChangePassword = function(req,res){
//     const login_database = readDatabase(LoginFile);
//     for(let i = 0; i< login_database.length;i++){
//         if(req.user.UserId==login_database[i].UserId){
//             if(bcrypt.compareSync(req.body.oldPassword,login_database[i].Password)){
//                 login_database[i].Password = bcrypt.hashSync(req.body.newPassword,8);
//                 writeDatabase(LoginFile,login_database);
//                 return res.status(200).json({
//                     msg : "Updated Successfuly"
//                 })
//             }else{
//                 return res.status(402).json({
//                     msg : "Old Password is Incorrect"
//                 })
//             }
//         }
//     }
//     res.status(401).json({
//         msg : "Email Lost",
//     })
// }

const ChangePassword = async function(req,res){
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.UserId; 
        const user = await User.findById(userId);
        if (!user) {
          return res.status(401).json({
            msg: "Email Lost"
          });
        }
    
        const passwordMatch = bcrypt.compareSync(oldPassword, user.Password);
        if (!passwordMatch) {
          return res.status(402).json({
            msg: "Old Password is Incorrect"
          });
        }
    
        user.Password = bcrypt.hashSync(newPassword, 8);
        await user.save();
    
        return res.status(200).json({
          msg: "Updated Successfully"
        });
    
    }   catch (error) {
        console.error(error);
        return res.status(500).json({
          msg: "Server Error",
          error
        });
    }
}

// const AccountDelete = function(req,res){
//     const login_database = readDatabase(LoginFile);
//     const product_database = readDatabase(ProductFile);
//     for(let i = 0 ; i < login_database.length ; i++ ){
//         if(login_database[i].Email == req.body.Email ){
//             if(bcrypt.compareSync(req.body.Password,login_database[i].Password)){
//                 login_database.splice(i,1); 
//                 writeDatabase(LoginFile,login_database);
//                 product_database.splice(i,1);
//                 writeDatabase(ProductFile,product_database);
//                 return res.status(200).json({
//                     msg : "Account Deleted"
//                 })
//             }else{ 
//                 return res.status(400).json({
//                     msg : "Incorrect Password..."
//                 })
//             }
//         }
//     }
//     return res.status(401).status({
//         msg : "Recheck Your Email ID "
//     })
// }

const AccountDelete = async function(req,res){
    try {
        const { Email, Password } = req.body;
    
        const user = await User.findOne({ Email });
        if (!user) {
          return res.status(401).json({
            msg: "Recheck Your Email ID"
          });
        }
    
        const passwordMatch = bcrypt.compareSync(Password, user.Password);
        if (!passwordMatch) {
          return res.status(400).json({
            msg: "Incorrect Password..."
          });
        }
        await Product.deleteOne({ UserId: user._id });
        await User.deleteOne({ _id: user._id });
        return res.status(200).json({
          msg: "Account Deleted"
        });
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          msg: "Server Error",
          error
        });
      }
    }

// const AddProduct = function(req,res){
//     const product_database = readDatabase(ProductFile);
//     for(let i = 0 ; i < product_database.length ; i++ ){
//         if(req.user.UserId==product_database[i].UserId){
//             let productId ;
//             if(product_database[i].Products == 0){
//                 productId = 1;
//             }else{
//                 productId = product_database[i].Products[product_database[i].Products.length-1].productId +1 ;
//             }
//             const timeInIST = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour12: false });
//             const newProduct = {
//                 productId : productId,
//                 uniqueId : req.user.UserId +"."+productId,
//                 ProductName : req.body.ProductName,
//                 Quantity : req.body.Quantity,
//                 ImagePath : req.body.Image,
//                 rating : 0,
//                 review : [],
//                 sold :0,
//                 Price : req.body.Price,
//                 NightCharge : req.body.NightCharge,
//                 Extra : req.body.Extra,
//                 SoldUnits : [],
//                 InProgress : [],
//                 DateTime : timeInIST
//             }
//             product_database[i].Products.push(newProduct);
//             writeDatabase(ProductFile,product_database);
//             res.status(200).json({
//                 msg : "Product Added Successfull"
//             });
//         }
//     }
// }

const AddProduct = async function(req, res) {
    try {
        const user = await User.findById(req.user.UserId);
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const productRecord = await Product.findOne({ UserId: user._id });
        if (!productRecord) {
            return res.status(404).json({
                msg: "Product record not found for this user"
            });
        }

        const lastProduct = productRecord.Products[productRecord.Products.length - 1];
        const productId = lastProduct ? lastProduct.productId + 1 : 1;

        const timeInIST = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour12: false });

        const newProduct = {
            productId: productId,
            uniqueId: `${user._id}.${productId}`,
            ProductName: req.body.ProductName,
            Quantity: req.body.Quantity,
            ImagePath: req.body.Image,
            rating: 0,
            review: [],
            sold: 0,
            Price: req.body.Price,
            NightCharge: req.body.NightCharge,
            Extra: req.body.Extra,
            SoldUnits: [],
            InProgress: [],
            DateTime: timeInIST
        };

        productRecord.Products.push(newProduct);
        await productRecord.save();

        return res.status(200).json({
            msg: "Product Added Successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error
        });
    }
};


// const UpdateProduct = function(req,res){
//     const product_database = readDatabase(ProductFile);
//     for(let i = 0 ; i < product_database.length ; i++ ){
//         if(req.user.UserId==product_database[i].UserId){
//             for(let j = 0 ; j < product_database[i].Products.length;j++){
//                 if(req.body.ProductName == product_database[i].Products[j].ProductName){
//                     product_database[i].Products[j].Quantity = req.body.Quantity
//                     product_database[i].Products[j].Price = req.body.Price
//                     product_database[i].Products[j].NightCharge = req.body.NightCharge
//                     product_database[i].Products[j].Extra = req.body.Extra
//                     writeDatabase(ProductFile,product_database);
//                     res.status(200).json({
//                         msg : "Prodct Update SuccessFull"
//                     })
//                 }
//             }
//         }
//     }
//     res.status(400).json({
//         msg : "Some Error Try to Input valid values" 
//     })
// }

const UpdateProduct = async function(req, res) {
    try {
        const productRecord = await Product.findOne({ UserId: req.user.UserId });
        
        if (!productRecord) {
            return res.status(404).json({
                msg: "Product record not found for this user"
            });
        }

        const productIndex = productRecord.Products.findIndex(p => p.ProductName === req.body.ProductName);
        
        if (productIndex === -1) {
            return res.status(404).json({
                msg: "Product not found"
            });
        }
        productRecord.Products[productIndex].Quantity= req.body.Quantity;
        productRecord.Products[productIndex].Price= req.body.Price;
        productRecord.Products[productIndex].Extra= req.body.Extra;
        // productRecord.Products[productIndex] = {
        //     ...productRecord.Products[productIndex],
        //     Quantity: req.body.Quantity,
        //     Price: req.body.Price,
        //     NightCharge: req.body.NightCharge,
        //     Extra: req.body.Extra
        // };
        // console.log(productRecord);
        await productRecord.save();

        return res.status(200).json({
            msg: "Product Update Successful",
            updatedProduct: productRecord.Products[productIndex] 
        });

    } catch (error) {
        console.error("Error during product update:", error);
        return res.status(500).json({
            msg: "Server Error",
            error
        });
    }
};

// const DeleteProduct = function(req,res){
//     const product_database = readDatabase(ProductFile);
//     for(let i = 0 ; i < product_database.length ; i++ ){
//         if(req.user.UserId==product_database[i].UserId){
//             for(let j = 0 ; j < product_database[i].Products.length;j++){
//                 if(req.body.ProductName == product_database[i].Products[j].ProductName){
//                     product_database[i].Products.splice(j,1);
//                     writeDatabase(ProductFile,product_database);
//                     res.status(201).json({
//                         msg : "Deletion of Product Successful"
//                     })
//                 }
//             }
//         }
//     }
//     res.status(400).json({
//         msg : "Some Error Try to Input valid values" 
//     })
// }

const DeleteProduct = async function(req, res) {
    try {
        const productRecord = await Product.findOne({ UserId: req.user.UserId });

        if (!productRecord) {
            return res.status(404).json({
                msg: "Product record not found for this user"
            });
        }
        const productIndex = productRecord.Products.findIndex(p => p.ProductName === req.body.ProductName);

        if (productIndex === -1) {
            return res.status(404).json({
                msg: "Product not found"
            });
        }

        productRecord.Products.splice(productIndex, 1);

        await productRecord.save();

        return res.status(200).json({
            msg: "Product Deletion Successful"
        });

    } catch (error) {
        console.error("Error during product deletion:", error);
        return res.status(500).json({
            msg: "Server Error",
            error
        });
    }
};

// const AllProducts = function(req,res){
//     const product_database = readDatabase(ProductFile);
//     let arr = []
//     for(let i = 0 ; i < product_database.length;i++){
//         for(let j = 0 ; j < product_database[i].Products.length;j++){
//             if(product_database[i].Products[j].Quantity>0 && (product_database[i].UserId !=req.user.UserId)){
//                 arr.push(product_database[i].Products[j]);
//             }
//         }
//     }
//     return res.status(200).json(arr);
// }

const AllProducts = async function(req, res) {
    try {
        const products = await Product.find({
            UserId: { $ne: req.user.UserId }, 
            "Products.Quantity": { $gt: 0 } 
        }).select('Products');

        const allProducts = products.flatMap(productRecord => productRecord.Products);

        return res.status(200).json(allProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error
        });
    }
};

// const YourProducts = function(req,res){
//     const product_database = readDatabase(ProductFile);
//     for(let i = 0 ; i < product_database.length;i++){
//         if((product_database[i].UserId == req.user.UserId)){
//             return res.status(200).json(product_database[i].Products); 
//         }
//     }
// }

const YourProducts = async function(req, res) {
    try {
        // Find the user's product record by UserId
        const productRecord = await Product.findOne({ UserId: req.user.UserId });
        
        if (!productRecord) {
            return res.status(404).json({
                msg: "No products found for this user"
            });
        }

        // Return the user's products
        return res.status(200).json(productRecord.Products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error
        });
    }
};

// const ProductBuying = function(req,res){
//     const login_database = readDatabase(LoginFile);
//     const product_database = readDatabase(ProductFile);
//     const chatDatabase = readDatabase(ChatFile)

//     for(let i = 0 ; i < product_database.length;i++){
//         for(let j = 0 ; j < product_database[i].Products.length;j++){
//             if(product_database[i].Products[j].uniqueId===req.body.uniqueId){
//                 product_database[i].Products[j].Quantity -= 1;
//                 let name = "unknown";
//                 let user_Index = -1;
//                 for(let k = 0 ; k < login_database.length ;k++){
//                     if(login_database[k].UserId==req.user.UserId){
//                         name = login_database[k].Email;
//                         user_Index = k;
//                         break;
//                     }
//                 }

//                 // Creating a room for chat and also Storing room no. in both accounts 
//                 let id = -1;
//                 if(chatDatabase.length==0){
//                     id = 1
//                 }else{
//                     id = chatDatabase[chatDatabase.length-1].ChatId+1;
//                 }
//                 const ChatGroup = {
//                     ChatId : id,
//                     Chats : []
//                 }
//                 chatDatabase.push(ChatGroup);

//                 const time_curr = new Date();
//                 console.log(time_curr)
//                 product_database[i].Products[j].InProgress.push({
//                     Units : 1,
//                     buyer : name,
//                     time : time_curr,
//                     ChatId : id
//                 })
//                 login_database[user_Index].InProgressBuying.push({
//                     ProductName : product_database[i].Products[j].ProductName,
//                     Units :1 ,
//                     Seller : login_database[i].Email,
//                     time : time_curr,
//                     ChatId : id
//                 })
//                 writeDatabase(LoginFile,login_database)
//                 writeDatabase(ProductFile,product_database);
//                 writeDatabase(ChatFile,chatDatabase)

//                 const contact = login_database[i].Email;
//                 res.status(200).json({
//                     msg : "Contact : "+contact+" For futher query."
//                 })
//             }
//         }
//     }
//     res.status(400).json({
//         msg : "Error in back "
//     }) 
// }

const ProductBuying = async function(req, res) {
    try {
        // Fetch the product record for the user
        const user = await User.findById(req.user.UserId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // console.log(req.body.uniqueId)
        // Fetch the product record for the seller
        const productRecord = await Product.findOne({ 'Products.uniqueId': req.body.uniqueId });
        if (!productRecord) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // Find the product by uniqueId
        const product = productRecord.Products.find(p => p.uniqueId === req.body.uniqueId);
        if (!product || product.Quantity-req.body.quantity <= 0) {
            console.log(productRecord)
            return res.status(400).json({ msg: "Product is out of stock" });
        }

        // Decrease the quantity of the product
        product.Quantity -= req.body.quantity;

        // Generate a unique ChatId for the new chat group
        const chatGroup = new ChatGroup({
            Chats: []
        });
        await chatGroup.save();

        const timeInIST = (new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour12: false })).toString();
        console.log(timeInIST)
        const seller = await User.findById({_id : productRecord.UserId});
        if (!seller) {
            return res.status(404).json({ msg: "Seller not found" });
        }

        // Add the product to the buyer's InProgressBuying list
        user.InProgressBuying.push({
            ProductName: product.ProductName,
            Units: req.body.quantity,
            Seller: seller.Name,
            time: timeInIST,
            ChatId: chatGroup._id
        });
        await user.save();

        // Add the transaction to the seller's InProgress list
        
        // seller.Bought.push({
        //     ProductName: product.ProductName,
        //     Units: 1,
        //     Buyer: user.Email,
        //     time: timeInIST,
        //     ChatId: chatGroup._id
        // });
        await seller.save();

        // Add the transaction to the product's InProgress list
        product.InProgress.push({
            Units: req.body.quantity,
            buyer: user.Name,
            time: timeInIST,
            ChatId: chatGroup._id
        });
        await productRecord.save();

        return res.status(200).json({
            msg: `Contact ${seller.Email} for further queries.`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error
        });
    }
};


// const Approving = function(req,res){
//     const login_database = readDatabase(LoginFile);
//     const product_database = readDatabase(ProductFile);
//     const chatDatabase = readDatabase(ChatFile);
//     let index = -1;
//     for(let i = 0 ; i < product_database.length ;i++){
//         if(req.user.UserId==product_database[i].UserId){
//             index = i;
//             break;
//         }
//     }
//     if(index==-1){
//         res.status(201).json({
//             msg:"not a valid user"
//         })
//     }
//     let product_index = -1;
//     for(let i = 0 ; i < product_database[index].Products.length ;i++){
//         if(product_database[index].Products[i].uniqueId==req.params.id){
//             product_index = i ;
//             break;
//         }
//     }
//     if(product_index==-1){
//         res.status(201).json({
//             msg:"not a valid product"
//         })
//     }
//     for(let i = 0 ; i < product_database[index].Products[product_index].InProgress.length;i++){
//         if(product_database[index].Products[product_index].InProgress[i].time==req.params.time){
//             const req_email = product_database[index].Products[product_index].InProgress[i].buyer
//             product_database[index].Products[product_index].SoldUnits.push(product_database[index].Products[product_index].InProgress[i]);
//             product_database[index].Products[product_index].InProgress.splice(i,1);
//             writeDatabase(ProductFile,product_database);
//             for(let i = 0 ;i < login_database.length;i++){
//                 if(login_database[i].Email==req_email){
//                     for(let j = 0 ; j < login_database[i].InProgressBuying.length;j++){
//                         if(login_database[i].InProgressBuying[j].time == req.params.time){
//                             login_database[i].Bought.push(login_database[i].InProgressBuying[j]);
//                             login_database[i].InProgressBuying.splice(j,1);
//                             writeDatabase(LoginFile,login_database);
//                             for(let i = 0 ; i < chatDatabase.length ;i++ ){
//                                 if(chatDatabase[i].ChatId==req.params.chatid){
//                                     chatDatabase.splice(i,1);
//                                     break;
//                                 }
//                             }
//                             writeDatabase(ChatFile,chatDatabase)
//                             res.status(200).json({
//                                 msg:"Added to sold "
//                             })
//                         }
//                     }
//                 }   
//             }
//             res.status(200).json({
//                 msg:"Added to sold "
//             })
//         }
//     }
//     res.status(201).json({
//         msg:"not a valid entry"
//     })
// }

const Approving = async function(req, res) {
    try {
        // Fetch the product record for the seller
        const productRecord = await Product.findOne({ 'Products.uniqueId': req.params.id, UserId: req.user.UserId });
        if (!productRecord) {
            return res.status(401).json({ msg: "Not a valid product or user" });
        }

        // Find the product by uniqueId
        const product = productRecord.Products.find(p => p.uniqueId === req.params.id);
        if (!product) {
            return res.status(402).json({ msg: "Not a valid product" });
        }

        // Find the transaction in the InProgress list of the product
        // console.log(product.InProgress)
        const transactionIndex = product.InProgress.findIndex(p => new Date(p.time).getTime() === new Date(req.params.time).getTime());

        // console.log(req.params.time)
        if (transactionIndex === -1) {
            return res.status(403).json({ msg: "Not a valid entry" });
        }

        const transaction = product.InProgress[transactionIndex];
        const buyerEmail = transaction.buyer;
        // console.log(buyerEmail+" "+transaction+" "+ product.InProgress)
        // Move the transaction from InProgress to SoldUnits for the product
        product.SoldUnits.push(transaction);
        product.InProgress.splice(transactionIndex, 1);
        await productRecord.save();

        // Find the buyer's record
        const buyer = await User.findOne({ Name : buyerEmail });
        if (!buyer) {
            return res.status(404).json({ msg: "Buyer not found" });
        }

        // Move the transaction from InProgressBuying to Bought for the buyer
        const buyerTransactionIndex = buyer.InProgressBuying.findIndex(p => new Date(p.time).getTime() === new Date(req.params.time).getTime());
        if (buyerTransactionIndex !== -1) {
            // console.log(buyer.InProgressBuying[buyerTransactionIndex])
            buyer.Bought.push(buyer.InProgressBuying[buyerTransactionIndex]);
            buyer.InProgressBuying.splice(buyerTransactionIndex, 1);
            await buyer.save();
            return res.status(200).json({ msg: "Transaction moved to Bought" });
        } else {
            return res.status(404).json({ msg: "Transaction not found in InProgressBuying" });
        }

        // Find the corresponding chat room and remove it
        const chat = await ChatGroup.findOne({ _id: req.params.chatid });
        if (chat) {
            await chat.remove();
        }

        return res.status(200).json({ msg: "Added to sold" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error", error });
    }
};


const GetQuery = function(req,res){
    const database = readDatabase(QueryFile);
    for(let i = 0 ; i < database.length ; i++){
        if(database[i].Question==req.body.Question){
            database[i].AskedFreq += 1;
            writeDatabase(QueryFile,database);
            return res.status(200).json({
                answer : database[i].Answer
            })
        }
    }
    return res.status(201).json({
        answer : "Sorry You can Contact team for futher queries.."
    })
}

const GetSamples = function(req,res){
    const database = readDatabase(QueryFile);
    let arr = []
    for(let i = 0 ; i < database.length ;i++){
        if((database[i].Question.toLowerCase()).includes(req.params.que.toLowerCase())){
            arr.push(database[i]);
        }
    }
    arr.sort((a, b) => b.AskedFreq - a.AskedFreq);
    return res.status(200).json({
        examples : arr.splice(0,5)
    })
}

// const YourBoughtProducts = function(req,res){
//     login_database = readDatabase(LoginFile);
//     for(let i = 0 ; i < login_database.length;i++){
//         if(login_database[i].UserId==req.user.UserId){
//             return res.status(200).json({
//                 InProgressBuying:login_database[i].InProgressBuying,
//                 Bought:login_database[i].Bought
//             })
//         }
//     }
//     return res.status(200).json({
//         msg : "Error person not found"
//     })
// }

const YourBoughtProducts = async function(req, res) {
    try {
        // Fetch the user from the database using the UserId from the JWT (req.user.UserId)
        const user = await User.findById(req.user.UserId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Return the InProgressBuying and Bought products of the user
        return res.status(200).json({
            InProgressBuying: user.InProgressBuying||[],
            Bought: user.Bought||[]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            msg: "Server Error",
            error 
        });
    }
};


// const reviewSystem = function(req,res){
//     const login_database = readDatabase(LoginFile);
//     const product_database = readDatabase(ProductFile);
//     let user_index = -1;
//     for(let i = 0 ; i < login_database.length ;i++){
//         if(req.body.Email==login_database[i].Email){
//             user_index = i;
//             break;
//         }
//     }
//     if(user_index==-1){
//         res.status(201).json({
//             msg:"not a valid user"
//         })
//     }
//     let product_index = -1;
//     for(let i = 0 ; i < product_database[user_index].Products.length ;i++){
//         if(product_database[user_index].Products[i].ProductName==req.body.ProductName){
//             product_index = i ;
//             break;
//         }
//     }
//     if(product_index==-1){
//         res.status(201).json({
//             msg:"not a valid product"
//         })
//     }
//     product_database[user_index].Products[product_index].review.push({
//         by : req.user.UserId,
//         review : req.body.Review
//     })
//     let curr = product_database[user_index].Products[product_index].rating ;
//     let count = product_database[user_index].Products[product_index].sold ;
//     let total = parseInt(curr) * parseInt(count) + parseInt(req.body.Rating);
//     curr = (total / (count + 1)).toFixed(2);
//     product_database[user_index].Products[product_index].rating = curr;
//     product_database[user_index].Products[product_index].sold = count+1;
//     writeDatabase(ProductFile,product_database);
//     return res.status(200).json({
//         msg : "Successfully updated"
//     })
// }

const reviewSystem = async function(req, res) {
    try {
        const { Id, ProductName, Review, Rating } = req.body;
        const productRecord = await Product.findOne({ 
            'Products.ProductName': ProductName
            // UserId: Id
        });

        if (!productRecord) {
            return res.status(200).json({
                msg: "Not a valid product"
            }); 
        }

        // Find the specific product by ProductName
        const product = productRecord.Products.find(p => p.ProductName === ProductName);
        
        if (!product) {
            return res.status(400).json({
                msg: "Product not found"
            });
        }

        // Add the review to the product's review array
        product.review.push({
            by: req.user.Name,
            review: Review
        });

        // Calculate new rating
        let currentRating = product.rating || 0;
        let soldCount = product.sold || 0;

        // Compute total rating based on existing ratings and new rating
        let totalRating = (currentRating * soldCount) + parseInt(Rating);
        currentRating = (totalRating / (soldCount + 1)).toFixed(2);

        // Update the product's rating and sold count
        product.rating = currentRating;
        product.sold = soldCount + 1;

        // Save the updated product record
        await productRecord.save();

        return res.status(200).json({
            msg: "Successfully updated"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error: error.message
        });
    }
};


// const GetChat = function(req,res){
//     const chatDatabase = readDatabase(ChatFile);
//     for(let i = 0 ; i < chatDatabase.length ;i++){
//         if(chatDatabase[i].ChatId==req.body.ChatId){
//             res.status(200).json({
//                 msg:"Done",
//                 chats : chatDatabase[i].Chats
//             })
//         }
//     }
//     res.status(200).json({
//         msg:"Not Done",
//         chats : []
//     })
// }

// const addChat = function(req,res){
//     const chatDatabase = readDatabase(ChatFile);
//     const login_database = readDatabase(LoginFile);

//     let name = "Unknown";
//     for(let i = 0 ; i < login_database.length ; i++){
//         if(login_database[i].UserId==req.user.UserId){
//             name = login_database[i].Name
//             break;
//         }
//     }

//     for(let i = 0 ; i < chatDatabase.length ;i++){
//         if(chatDatabase[i].ChatId==req.body.ChatId){
//             const newChat = {
//                 person : name,
//                 chat : req.body.msg
//             }
//             chatDatabase[i].Chats.push(newChat);
//             writeDatabase(ChatFile,chatDatabase);
//             res.status(200).json({
//                 msg : "added"
//             })
//         }
//     }
//     res.status(201).json({
//         msg:"Not Done"
//     })
// }

const GetChat = async function(req, res) {
    try {
        const chatGroup = await ChatGroup.findOne({ '_id': req.body.ChatId });
        if (chatGroup) {
            return res.status(200).json({
                msg: "Chat found",
                chats: chatGroup.Chats||[]
            });
        } else {
            return res.status(404).json({
                msg: "Chat not found",
                chats: []
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error
        });
    }
};


const addChat = async function(req, res) {
    try {
        const chatGroup = await ChatGroup.findOne({ '_id': req.body.ChatId });
        if (chatGroup) {
            const newChat = {
                sender: req.user.Name,  // Assuming `req.user.Name` holds the name of the sender
                message: req.body.msg,
                timestamp: new Date() // Current timestamp
            };
            chatGroup.Chats.push(newChat);
            await chatGroup.save();
            return res.status(200).json({
                msg: "Message added successfully"
            });
        } else {
            console.log(req.body.ChatId)
            return res.status(404).json({
                msg: "Chat group not found"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error
        });
    }
};


const FileUpload = function(req,res){
    if (!req.file) {
        return res.status(400).json({
            msg : 'No file uploaded'});
    }
    res.json({ 
        path: `/Functions/Database/Uploads/${req.file.filename}` ,
        msg :"uploaded"
    });
}
 

module.exports = {Login,SignUp,UpdateProfile,ChangePassword,AccountDelete,AddProduct,UpdateProduct,DeleteProduct,AllProducts,YourProducts,ProductBuying,Approving,GetQuery,GetSamples,YourBoughtProducts,reviewSystem,GetChat,addChat,FileUpload};
