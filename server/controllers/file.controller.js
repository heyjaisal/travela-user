const cloudinary = require("../config/cloudinary");
const multer = require("multer");

const upload = multer({ dest: "uploads/" }); // fallback, if needed

exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "chat_media",
        });

        res.status(200).json({
            public_id: result.public_id,
            url: result.secure_url,
            resource_type: result.resource_type,
        });
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        res.status(500).json({ message: "File upload failed" });
    }
};
