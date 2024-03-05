const router = require("express").Router();
const providerCtrl = require("../controllers/providerController");
const isAuthenticated = require("../controllers/isAuthenticated");


router.get('/', providerCtrl.index);
router.use(isAuthenticated);
router.get('/new', providerCtrl.new);
router.post('/', providerCtrl.create);
router.get('/seed', providerCtrl.seed);
router.get('/openAI', providerCtrl.generate);
//router.get('/:id', providerCtrl.show);
router.delete('/', providerCtrl.destroy);
//router.get('/:id/edit', providerCtrl.edit);
router.put('/', providerCtrl.update);

module.exports = router;
