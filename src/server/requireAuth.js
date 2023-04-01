const jwt = require('jsonwebtoken')

const requireAuth = async (req, res, next) => {

    //verify authentication
    const { authorization } = req.headers

    if (!authorization) return res.status(401).json({ error: 'Authorization token required' })
    const token = authorization.split(' ')[1];
    try {
        const { id, isProfessor } = jwt.verify(token, process.env.SECRET)
        console.log(id, isProfessor)
        req.user = { id, isProfessor };
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Request is not authorized' })

    }

}

module.exports = requireAuth;