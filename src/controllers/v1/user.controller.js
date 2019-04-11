const get = async (req, res, next) => {
    return res.json({message: 'users get'})
}

export { get }