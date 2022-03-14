import express from 'express';
import path from 'path'

const router = express.Router();

// react render setups for the client
router.use(express.static(path.join(__dirname, "client", "dist")));
router.use(express.static("src/public"));

router.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

export default router;