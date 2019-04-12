const redis = require('redis')
const bluebird = require('bluebird')
import UserRepo from '../repositories/user.repository'

class UserCache {
  constructor() {
    this.client = redis.createClient()
    this.client.on('connenct', () => {
      bluebird.promisifyAll(client)
    })

    this.client.on('error', (e) => {
      console.error(`redis error : ${e}`)
    })
  }

  async store(user) {
    try {
      await this.client.hsetAsync('users:id', [user.id, user.uuid])
      await this.client.hsetAsync('users:email', [user.email, user.uuid])
      await this.client.hsetAsync('users:uuid', [user.uuid, JSON.stringify(user.toJSON())])
    } catch (e) {
      // error 로깅 
    }
  }

  async find(uuid) {
    if (uuid) {
      try {
        const user = await this.client.hgetAsync('users:uuid', uuid)

        if (!user) {
          return null
        }
        
        return JSON.parse(user)
      } catch (e) {
        // error 로깅
        return null
      }
    }
    return null
  }

  async findById(id) {
    if (id) {
      try {
        const uuid = await this.client.hgetAsync('users:id', id)
        return this.find(uuid)
      } catch (e) {
        // error 로깅
        return null
      }
    }
    return null
  }

  async findByEmail(email) {
    if (email) {
      try {
        const uuid = await this.client.hgetAsync('users:email', email)
        return this.find(uuid)
      } catch (e) {
        // error 로깅
        return null
      }
    }
    return null
  }
}

export default UserCache

// const redis = require('redis')
// const bluebird = require('bluebird')
// const client = redis.createClient()
// // redis 의 모든 함수를 promisify
// bluebird.promisifyAll(client)

// const store = async (user) => {
//   await client.hsetAsync('users:id', [user.id, user.uuid])
//   await client.hsetAsync('users:email', [user.email, user.uuid])
//   await client.hsetAsync('users:uuid', [user.uuid, JSON.stringify(user.toJSON())])
// }

// const find = async (uuid) => {
//   if (uuid) {
//     const user = await client.hgetAsync('users:uuid', `${uuid}`)

//     return JSON.parse(user)
//   }

//   return null
// }

// const findById = async (id) => {
//   const uuid = await client.hgetAsync('users:id', `${id}`)

//   return find(uuid)
// }

// const findByEmail = async (email) => {
//   const uuid = await client.hgetAsync('users:email', `${email}`)

//   return find(uuid)
// }

// export default {
//   store,
//   find,
//   findById,
//   findByEmail
// }