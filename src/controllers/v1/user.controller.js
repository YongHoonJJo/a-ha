import httpStatus from 'http-status'
import createError from 'http-errors'
import {
  models
} from '../../models'

const get = async (req, res, next) => {
  try {
    if (req.params.uuid) {
      const {uuid} = req.params;
      const user = await models.User.findOne({
        where: {
          uuid: Buffer(uuid, 'hex')
        }
      })

      if (!user) {
        throw (createError(httpStatus.NOT_FOUND, '사용자를 찾을 수 없습니다.'))
      }

      return res
        .status(httpStatus.OK)
        .json(user)
    } else {
      const users = await models.User.findAll()
      return res.json(users)
    }
  } catch (e) {
    next(e)
  }
}

export {
  get
}