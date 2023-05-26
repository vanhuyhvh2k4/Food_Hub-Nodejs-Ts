import multer from "multer";
const multerError = (err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        // Multer error
        res.status(400).json({
            error: err.message
        });
    } else if (err) {
        // Other error
        res.status(err.status || 500).json({
            error: err.message
        });
    } else {
        next();
    }
}

export default multerError;