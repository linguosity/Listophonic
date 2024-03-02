const router = require("express").Router();
const providerCtrl = require("../controllers/providerController");

router.get('/', providerCtrl.index);
router.get('/new', providerCtrl.new);
router.post('/', providerCtrl.create);
router.get('/seed', providerCtrl.seed);
router.get('/openAI', providerCtrl.generate);
//router.get('/:id', providerCtrl.show);
router.delete('/', providerCtrl.destroy);
//router.get('/:id/edit', providerCtrl.edit);
//router.put('/:id', providerCtrl.update);

module.exports = router;
