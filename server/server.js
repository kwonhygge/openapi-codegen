const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 메모리에 데이터 저장
let users = [
    { id: 1, name: '홍길동', email: 'hong@example.com' },
    { id: 2, name: '김철수', email: 'kim@example.com' }
];

let products = [
    { id: 1, name: '노트북', price: 1200000, stock: 10, category: '전자기기' },
    { id: 2, name: '스마트폰', price: 800000, stock: 15, category: '전자기기' },
    { id: 3, name: '커피머신', price: 300000, stock: 5, category: '주방용품' }
];

// Swagger 정의
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sample API',
            version: '1.0.0',
            description: '사용자와 제품 관리를 위한 CRUD API'
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: '개발 서버'
            }
        ],
        tags: [
            {
                name: 'Users',
                description: '사용자 관리 API'
            },
            {
                name: 'Products',
                description: '제품 관리 API'
            }
        ]
    },
    apis: ['./server.js']
};

const specs = swaggerJsdoc(swaggerOptions);

// swagger.json 파일 생성
fs.writeFileSync('./swagger.json', JSON.stringify(specs, null, 2));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: 자동 생성되는 사용자 ID
 *         name:
 *           type: string
 *           description: 사용자 이름
 *         email:
 *           type: string
 *           description: 사용자 이메일
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: 자동 생성되는 제품 ID
 *         name:
 *           type: string
 *           description: 제품 이름
 *         price:
 *           type: number
 *           description: 제품 가격
 *         stock:
 *           type: integer
 *           description: 재고 수량
 *         category:
 *           type: string
 *           description: 제품 카테고리
 */

// 사용자 API
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: 모든 사용자 목록 조회
 *     description: 등록된 모든 사용자의 목록을 반환합니다.
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 목록을 반환함
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: 특정 사용자 조회
 *     description: 특정 ID를 가진 사용자의 정보를 반환합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 사용자의 ID
 *     responses:
 *       200:
 *         description: 사용자 정보를 성공적으로 반환함
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: 새 사용자 생성
 *     description: 새로운 사용자를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: 사용자 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
app.post('/users', (req, res) => {
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
        name: req.body.name,
        email: req.body.email
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// 제품 API
/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: 모든 제품 목록 조회
 *     description: 등록된 모든 제품의 목록을 반환합니다.
 *     responses:
 *       200:
 *         description: 성공적으로 제품 목록을 반환함
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/products', (req, res) => {
    res.status(200).json(products);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: 특정 제품 조회
 *     description: 특정 ID를 가진 제품의 정보를 반환합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 제품의 ID
 *     responses:
 *       200:
 *         description: 제품 정보를 성공적으로 반환함
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 제품을 찾을 수 없음
 */
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(product => product.id === id);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: '제품을 찾을 수 없습니다.' });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    console.log(`Swagger 문서는 http://localhost:${port}/api-docs 에서 확인할 수 있습니다.`);
    console.log(`Swagger JSON은 http://localhost:${port}/swagger.json 에서 확인할 수 있습니다.`);
});