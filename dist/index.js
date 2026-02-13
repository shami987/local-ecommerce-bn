"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables FIRST before any other imports
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = require("./config/database");
const swagger_1 = require("./config/swagger");
const auth_1 = __importDefault(require("./routes/auth"));
const category_1 = __importDefault(require("./routes/category"));
const product_1 = __importDefault(require("./routes/product"));
const shop_1 = __importDefault(require("./routes/shop"));
const promotion_1 = __importDefault(require("./routes/promotion"));
const cart_1 = __importDefault(require("./routes/cart"));
const order_1 = __importDefault(require("./routes/order"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// Middleware
app.use(express_1.default.json());
// Swagger Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/categories', category_1.default);
app.use('/api/products', product_1.default);
app.use('/api/shops', shop_1.default);
app.use('/api/promotions', promotion_1.default);
app.use('/api/cart', cart_1.default);
app.use('/api/orders', order_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'Auth API is running',
        documentation: '/api-docs'
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
// Connect to MongoDB after server starts
(0, database_1.connectDB)();
