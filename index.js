const express = require('express'); 
const app = express(); 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
require('./passport')


//importing model
const User = require('./models/User');

//Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/lab3', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

app.use(session({ 
    secret: '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', 
    resave: false,
    saveUninitialized: false 
})); 
app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => { 
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login with Google</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }

                .container {
                    text-align: center;
                }

                h1 {
                    color: black;
                    margin-bottom: 20px;
                }

                button {
                    background-color: #4285f4;
                    color: #ffffff;
                    padding: 10px 20px;
                    font-size: 16px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                }

                button:hover {
                    background-color: #357ae8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Google Sign-In Authentication</h1>
                <button><a href='/auth' style="text-decoration:none; color:inherit;">Login With Google</a></button>
                <button><a href='/auth/local' style="text-decoration:none; color:inherit;">Login With Email</a></button>
            </div>
        </body>
        </html>
    `); 
});


app.get('/auth' , passport.authenticate('google', { scope: 
    [ 'email', 'profile' ] 
})); 

// Auth Callback 
app.get( '/auth/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/callback/success', 
        failureRedirect: '/auth/callback/failure'
})); 
  
// Success  
// app.get('/auth/callback/success' , (req , res) => { 
//     if(!req.user) 
//         res.redirect('/auth/callback/failure'); 
//     res.send("Welcome  " + req.user.email); 
// }); 
  
// // failure 
// app.get('/auth/callback/failure' , (req , res) => { 
//     res.send("Error"); 
// })

app.get('/auth/callback/success', (req, res) => {
    if (!req.user) {
        res.redirect('/auth/callback/failure');
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        flex-direction: column;
                    }

                    h1 {
                        color: black;
                        margin-bottom: 20px;
                    }

                    p {
                        margin-bottom: 20px;
                    }

                    button {
                        background-color: #4285f4;
                        color: #ffffff;
                        padding: 10px 20px;
                        font-size: 16px;
                        border: none;
                        cursor: pointer;
                        text-decoration: none;
                    }

                    button:hover {
                        background-color: #357ae8;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>Welcome! You are logged in</h1>
                    <p>Email: ${req.user.email}</p>
                    <button><a href='/logout' style="text-decoration:none; color:inherit;">Logout</a></button>
                </div>
            </body>
            </html>
        `);
    }
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.send('Error during logout');
        }
        res.redirect('/');
    });
});

app.get('/auth/local', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Local Authentication</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }

                .container {
                    text-align: center;
                }

                h1 {
                    color: black;
                    margin-bottom: 20px;
                }

                button {
                    background-color: #4285f4;
                    color: #ffffff;
                    padding: 10px 20px;
                    font-size: 16px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                }

                button:hover {
                    background-color: #357ae8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Local Authentication</h1>
                <form action="/auth/local" method="POST">
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// app.post('/auth/local', passport.authenticate('local',{
//     successRedirect: '/auth/local/success',
//     failureRedirect: '/auth/local/failure'
//     // Store in db
// }), async (req, res) => {
//     try {
//         console.log(user.email);
//         console.log(user.password);
//         const user = req.user; // Assuming user data is available in req.user after authentication
        
//         const existingUser = await User.findOne({ email: user.email });

//         if (!existingUser) {
//             // If the user doesn't exist, create a new user record in the database
//             const newUser = new User({
//                 email: user.email,
//                 password: user.password,
//             });

//             await newUser.save();
//             res.redirect('/auth/local/success');
//         } else {
//             res.redirect('/auth/local/success');
//         }
//     } catch (err) {
//         console.error(err);
//         res.redirect('/auth/local/failure');
//     }
// });

app.post('/auth/local', async (req, res) => {
    try {
        const user = req.body; // Assuming user data is available in req.user after authentication
        console.log(user);  
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
            // If the user doesn't exist, create a new user record in the database
            const newUser = new User({
                email: user.email,
                password: user.password,
            });

            await newUser.save();
            res.redirect('/auth/local/success');
        } else {
            res.redirect('/auth/local/success');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/auth/local/failure');
    }
});

app.get('/auth/local/success', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Authentication Success</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }
    
            .container {
                text-align: center;
            }
    
            h1 {
                color: green;
                margin-bottom: 20px;
            }
    
            p {
                margin-bottom: 20px;
            }
    
            button {
                background-color: #4285f4;
                color: #ffffff;
                padding: 10px 20px;
                font-size: 16px;
                border: none;
                cursor: pointer;
                text-decoration: none;
            }
    
            button:hover {
                background-color: #357ae8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Local Authentication Success</h1>
            <p>You have successfully logged in using your email and password.</p>
            <button><a href='/logout' style="text-decoration:none; color:inherit;">Logout</a></button>
        </div>
    </body>
    </html>
    

    `);
});

app.get('/auth/local/failure', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Authentication Failure</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }
    
            .container {
                text-align: center;
            }
    
            h1 {
                color: red;
                margin-bottom: 20px;
            }
    
            p {
                margin-bottom: 20px;
            }
    
            button {
                background-color: #4285f4;
                color: #ffffff;
                padding: 10px 20px;
                font-size: 16px;
                border: none;
                cursor: pointer;
                text-decoration: none;
            }
    
            button:hover {
                background-color: #357ae8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Local Authentication Failure</h1>
            <p>Invalid email or password. Please try again.</p>
            <button><a href='/' style="text-decoration:none; color:inherit;">Back to Home</a></button>
        </div>
    </body>
    </html>
    
    `);
});

app.use(passport.initialize());
app.use(passport.session());

app.listen(3000 , () => { 
    console.log("Server running on port 3000"); 
});