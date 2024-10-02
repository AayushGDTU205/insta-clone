export const responseHandler =  (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            // console.log(error.message);
            res.status(error.statusCode||500).json({
                success: false,
                message: error.message
            })
        }
    }
}

