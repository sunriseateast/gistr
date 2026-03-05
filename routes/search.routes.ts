import express from 'express'
import { searchEntities } from '../controllers/searchEntities.ts'

const router=express.Router()

//to search entities
router.get('/search-entities',searchEntities)


export default router