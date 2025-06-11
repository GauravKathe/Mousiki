import { Router } from "express";
import { createSong,deleteSong,createAlbum,deleteAlbum } from "../controller/admin.controller.js";
import { protectRoute, requiredAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/songs",protectRoute , requiredAdmin , createSong);
router.delete("/songs/:id",protectRoute , requiredAdmin , deleteSong);


router.post("/albums",protectRoute , requiredAdmin , createAlbum);
router.delete("/albums/:id",protectRoute , requiredAdmin , deleteAlbum);
export default router;