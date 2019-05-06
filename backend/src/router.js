import express from 'express';

const router = express.Router();
const crypto = require('crypto');

router.get('/', (req, res) => res.send('Express server API'));
router.post('/login', (req, res) => {
	const hash = crypto.createHash('sha512');
	console.log(req.body.login, hash.update(req.body.password).digest('hex'));
	res.send(true);
});

module.exports = router;