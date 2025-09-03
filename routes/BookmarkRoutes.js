const router = require('express').Router();
const Bookmark=require ('../models/Bookmark');
const verifyAuthentication = require('../middleware/auth-middleware')
// Apply authMiddleware to all routes in this file
router.use(verifyAuthentication);
 
// GET /api/bookmark - Get all notes for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get('/', async (req, res) => {
  // This currently finds all bookmarks in the database.
  // It should only find notes owned by the logged in user.
  try {
    const Bookmarks = await Bookmark.find({user:req.user_Id});
    res.json(Bookmarks);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// POST /api/bookmark - Create a new bookmark
router.post('/', async (req, res) => {
  try {
    const bookmark= await Bookmark.create({
      ...req.body,
      user:req.user._Id,
      // The user ID needs to be added here
      
    });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(400).json(err);
  }
});
 
// PUT /api/bookmark/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const bookmark= await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bookmark) {
      return res.status(404).json({ message: 'No bookmark found with this id!' });
    }
    else if(!bookmark.user.equals(req.user._id)){
      return res.status(403).json({message:'User is not authorizwd to update this bookmark.'})
    }
    res.json(bookmark);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// DELETE /api/bookmark/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const bookmark= await Bookmark.findByIdAndDelete(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ message: 'No bookmark found with this id!' });
    }
    if(!bookmark.req.equals(req.user._id)){
      return res.status(403).json({message:'User is not authorized to update this bookmark'})
    }
    res.json({ message: 'Bookmark deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});
//Get single bookmark with ownership check

router.get('/id',async(req,res)=>{
try{ const bookmark= await Bookmark.findById(req.params.id)
 if(!bookmark){
  return res.status(400).json({message:'No bookmark found with this id.'})
   }
 else if(!bookmark.req.equals(req.user._id)){
  return res.status(403).json({message:'User not authorized to access this bookmark'})
 }
 res.json(bookmark)

}
catch(err){
res.status(500).json(err)
}
})
 
module.exports = router;