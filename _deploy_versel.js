/* 1. add vercel.json file config
2. vercel
3. add: npm run build
3. create vercel.json file in your root folder and paste
{
    "version": 2,
    "builds": [
        {
            "src": "./index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/"
        }
    ]
} 

4. ? Set up and deploy “D:\Milestore-11.Backend and Database Integrate\genius-car-server”? [Y/n] y
? Which scope do you want to deploy to? Emon Hossain
? Link to existing project? [y/N] n
? What’s your project’s name? y
? What’s your project’s name? genius-car-server
? In which directory is your code located? ./






*/