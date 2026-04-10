const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const products = [
    {
        name: 'Paracetamol 500mg',
        price: 50,
        mrp: 65,
        description: 'Fever & pain relief · Strip of 10',
        category: 'tablets',
        dose: '500mg',
        type: 'OTC',
        inStock: true,
        img: '../public/paracetamol-tablet-500-mg-500x500.webp'
    },
    {
        name: 'Cough Syrup 100ml',
        price: 120,
        mrp: 150,
        description: 'Relieves dry & wet cough',
        category: 'syrups',
        dose: '100ml',
        type: 'OTC',
        inStock: true,
        img: '../public/cough.png'
    },
    {
        name: 'Vitamin C 1000mg',
        price: 200,
        mrp: 250,
        description: 'Immunity booster · 30 tablets',
        category: 'vitamins',
        dose: '1000mg',
        type: 'OTC',
        inStock: true,
        img: ''
    },
    {
        name: 'Vitamin D3 60K IU',
        price: 180,
        mrp: 220,
        description: 'Bone & immunity health · 4 capsules',
        category: 'vitamins',
        dose: '60K IU',
        type: 'Rx',
        inStock: true,
        img: ''
    },
    {
        name: 'Antacid Syrup 200ml',
        price: 95,
        mrp: 115,
        description: 'Relieves acidity & heartburn',
        category: 'syrups',
        dose: '200ml',
        type: 'OTC',
        inStock: true,
        img: ''
    },
    {
        name: 'Ibuprofen 400mg',
        price: 35,
        mrp: 45,
        description: 'Pain & inflammation relief · 10 tabs',
        category: 'tablets',
        dose: '400mg',
        type: 'OTC',
        inStock: true,
        img: ''
    },
    {
        name: 'Multivitamin Daily',
        price: 350,
        mrp: 420,
        description: 'Complete nutrition · 60 tablets',
        category: 'vitamins',
        dose: 'Daily',
        type: 'OTC',
        inStock: true,
        img: ''
    },
    {
        name: 'Antiseptic Cream 30g',
        price: 75,
        mrp: 90,
        description: 'For wounds & minor cuts',
        category: 'creams',
        dose: '30g',
        type: 'OTC',
        inStock: true,
        img: ''
    }
];

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
