const checkAuth = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not logged in' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded contains the payload (user info)
        res.json({ success: true, user: decoded });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export { checkAuth };